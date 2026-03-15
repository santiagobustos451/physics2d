import Vector2 from "../types/vector2";

export enum BodyType {
  static,
  dynamic,
  kinematic,
}

export class PhysicsBody {
  type: BodyType;
  shape: PhysicsShape;
  position: Vector2;
  rotation: number;
  linearVelocity: Vector2;
  angularVelocity: number;
  density: number;
  area: number;
  elasticity: number;
  mass: number;
  invMass: number;

  constructor(
    type: BodyType,
    shape: PhysicsShape,
    position: Vector2,
    rotation: number,
    linearVelocity: Vector2,
    angularVelocity: number,
    density: number,
    area: number,
    elasticity: number,
    mass: number,
    invMass: number,
  ) {
    this.type = type;
    this.shape = shape;
    this.position = position;
    this.rotation = rotation;
    this.linearVelocity = linearVelocity;
    this.angularVelocity = angularVelocity;
    this.density = density;
    this.area = area;
    this.elasticity = elasticity;
    this.mass = mass;
    this.invMass = invMass;
  }
}

export enum ShapeType {
  circle,
  polygon,
}

interface PhysicsShapeBase {
  type: ShapeType;
}

interface PhysicsShapeCircle extends PhysicsShapeBase {
  type: ShapeType.circle;
  radius: number;
}

interface PhysicsShapePolygon extends PhysicsShapeBase {
  type: ShapeType.polygon;
  vertices: Vector2[];
}

export type PhysicsShape = PhysicsShapeCircle | PhysicsShapePolygon;

export type AABB = {
  min: Vector2;
  max: Vector2;
};

export function computeArea(shape: PhysicsShape): number {
  switch (shape.type) {
    case ShapeType.circle:
      return shape.radius ** 2 * Math.PI;
    case ShapeType.polygon:
      let area = 0;
      for (let i = 0; i < shape.vertices.length; i++) {
        let j = (i + 1) % shape.vertices.length;
        area += shape.vertices[i].x * shape.vertices[j].y;
        area -= shape.vertices[j].x * shape.vertices[i].y;
      }
      return Math.abs(area) / 2;
  }
}
