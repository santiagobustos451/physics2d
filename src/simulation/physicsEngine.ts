import { CollisionManifold } from "../types/collisions";
import {
  AABB,
  BodyType,
  computeArea,
  PhysicsBody,
  PhysicsShape,
  ShapeType,
} from "../types/physicsBody";
import Vector2 from "../types/vector2";
import { forEachPair } from "../utils/helpers";

export interface PhysicsConfig {
  slop: number;
  penCorrection: number;
}

export class PhysicsEngine {
  public config: PhysicsConfig;
  public bodies: Map<string, PhysicsBody> = new Map();

  constructor(config: Partial<PhysicsConfig> = {}) {
    this.config = {
      slop: config.slop ?? 0.01,
      penCorrection: config.penCorrection ?? 0.8,
    };
  }

  public addBody(bodyDef: Partial<PhysicsBody>) {
    const body = new PhysicsBody(
      bodyDef.type ?? BodyType.static,
      bodyDef.shape ?? { type: ShapeType.circle, radius: 1 },
      bodyDef.position ?? new Vector2(0, 0),
      bodyDef.rotation ?? 0,
      bodyDef.linearVelocity ?? new Vector2(0, 0),
      bodyDef.angularVelocity ?? 0,
      bodyDef.density ?? 1,
      0, // area will be computed below,
      bodyDef.elasticity ?? 1,
      0,
      0,
    );

    body.area = computeArea(body.shape);

    if (body.type === BodyType.static) {
      body.mass = Infinity;
      body.invMass = 0;
    } else {
      body.mass = body.density * body.area;
      body.invMass = 1 / body.mass;
    }

    this.bodies.set(crypto.randomUUID(), body);
  }

  public step(delta: number) {
    for (const [_key, body] of this.bodies) {
      body.position = body.position.add(body.linearVelocity.multiply(delta));
    }

    forEachPair<PhysicsBody>(Array.from(this.bodies.values()), (a, b) => {
      const coll = this.detectCollision(a, b);
      if (coll.isColliding) {
        this.solveCollision(coll);
        this.solveOverlap(coll);
      }
    });
  }

  private detectCollision(a: PhysicsBody, b: PhysicsBody): CollisionManifold {
    if (
      a.shape.type === ShapeType.circle &&
      b.shape.type === ShapeType.circle
    ) {
      const normal = b.position.diff(a.position).normalize();
      const penetration =
        a.shape.radius +
        b.shape.radius -
        a.position.diff(b.position).magnitude();

      return {
        isColliding: penetration > 0,
        penetration: penetration,
        normal: normal,
        a: a,
        b: b,
      };
    }
    return {
      isColliding: false,
      penetration: 0,
      normal: undefined,
      a: a,
      b: b,
    };
  }

  private solveCollision(coll: CollisionManifold) {
    if (
      coll.a.shape.type === ShapeType.circle &&
      coll.b.shape.type === ShapeType.circle
    ) {
      const n = coll.normal!;
      const e = Math.min(coll.a.elasticity, coll.b.elasticity);
      const relVel = coll.b.linearVelocity.diff(coll.a.linearVelocity);

      if (relVel.dot(n) > 0) return;

      if (coll.a.invMass + coll.b.invMass === 0) return;

      //Impulse Calculation
      const impulse =
        (-(1 + e) / (coll.a.invMass + coll.b.invMass)) * relVel.dot(n);

      //Solve velocities
      coll.a.linearVelocity = coll.a.linearVelocity.diff(
        n.multiply(impulse * coll.a.invMass),
      );
      coll.b.linearVelocity = coll.b.linearVelocity.add(
        n.multiply(impulse * coll.b.invMass),
      );
    }
  }

  private solveOverlap(coll: CollisionManifold) {
    const n = coll.normal!;
    const mSum = coll.a.invMass + coll.b.invMass;

    if (mSum === 0) return;

    const correction =
      Math.max(coll.penetration - this.config.slop, 0) *
      this.config.penCorrection;

    coll.a.position = coll.a.position.diff(
      n.multiply((correction * coll.a.invMass) / mSum),
    );
    coll.b.position = coll.b.position.add(
      n.multiply((correction * coll.b.invMass) / mSum),
    );
  }

  private getAABB(body: PhysicsBody): AABB {
    if (body.shape.type !== ShapeType.polygon) {
      throw new Error("getAABB can only be called for polygon shapes.");
    }

    const vertices = body.shape.vertices;
    const minX = Math.min(...vertices.map((v) => v.x));
    const maxX = Math.max(...vertices.map((v) => v.x));
    const minY = Math.min(...vertices.map((v) => v.y));
    const maxY = Math.max(...vertices.map((v) => v.y));

    return {
      min: new Vector2(minX, minY),
      max: new Vector2(maxX, maxY),
    };
  }
}
