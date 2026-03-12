import { CollisionManifold } from "../types/collisions";
import { BodyType, PhysicsBody, PhysicsShape, ShapeType } from "../types/physicsBody";
import Vector2 from "../types/vector2";
import { forEachPair } from "../utils/helpers";

export class PhysicsEngine {
    public bodies: Map<string, PhysicsBody> = new Map();

    public addBody(bodyDef: Partial<PhysicsBody>){
        const body = new PhysicsBody(
            bodyDef.type ?? BodyType.static,
            bodyDef.shape ?? {type: ShapeType.circle, radius: 1},
            bodyDef.position ?? new Vector2(0,0),
            bodyDef.rotation ?? 0,
            bodyDef.linearVelocity ?? new Vector2(0,0),
            bodyDef.angularVelocity ?? 0,
            bodyDef.density ?? 1,
            0 // area will be computed below
        );

        body.area = this.computeArea(body.shape);

        this.bodies.set(crypto.randomUUID(), body);
    }

    private computeArea(shape: PhysicsShape){
        switch(shape.type){
            case ShapeType.circle:
                return shape.radius ** 2 * Math.PI;
            case ShapeType.polygon:
                let area = 0;
                for(let i = 0; i < shape.vertices.length; i++) {
                    let j = (i + 1) % shape.vertices.length;
                    area += shape.vertices[i].x * shape.vertices[j].y;
                    area -= shape.vertices[j].x * shape.vertices[i].y;
                }
                return Math.abs(area) / 2;
        }
    }

    public step(delta: number) {
        for(const [_key, body] of this.bodies) {
            body.position = body.position.add(body.linearVelocity.multiply(delta))
        }

        forEachPair<PhysicsBody>(Array.from(this.bodies.values()), (a,b) => {
            const coll = this.detectCollision(a,b)
            if(coll.isColliding) this.solveCollision(coll);
        })
    }

    private detectCollision(a: PhysicsBody, b: PhysicsBody): CollisionManifold {
        if(a.shape.type === ShapeType.circle && b.shape.type === ShapeType.circle){
            const normal = b.position.diff(a.position).normalize();
            const approaching = b.linearVelocity.diff(a.linearVelocity).dot(normal) <= 0;

            return {
                isColliding: a.position.diff(b.position).magnitude() <= a.shape.radius + b.shape.radius && approaching,
                penetration: 0,
                normal: normal,
                a: a,
                b: b,
            }
        }
        return {
            isColliding: false,
            penetration: 0,
            normal: undefined,
            a: a,
            b: b,
        }
    }

    private solveCollision(coll: CollisionManifold){
        if(coll.a.shape.type === ShapeType.circle && coll.b.shape.type === ShapeType.circle){
            console.log("colliding");

            const n = coll.normal!;
            const t = coll.normal!.rotate(Math.PI / 2);

            const compA = this.getComponents(coll.a, n);
            const compB = this.getComponents(coll.b, n);

            const mSum = coll.a.mass + coll.b.mass;

            // Resultant along normal
            const vn_a = n.multiply((coll.a.mass - coll.b.mass) * compA.n / mSum + ((2 * coll.b.mass) / mSum) * compB.n);
            const vn_b = n.multiply((coll.b.mass - coll.a.mass) * compB.n / mSum + ((2 * coll.a.mass) / mSum) * compA.n);

            // Tan stays the same
            const vt_a = t.multiply(compA.t);
            const vt_b = t.multiply(compB.t);

            // Apply to bodies
            coll.a.linearVelocity = vn_a.add(vt_a);
            coll.b.linearVelocity = vn_b.add(vt_b);
        }
    }

    private getComponents(body: PhysicsBody, normal: Vector2): ComponentScalar{
        const tan = normal.rotate(Math.PI / 2);
        return {
            n: body.linearVelocity.dot(normal),
            t: body.linearVelocity.dot(tan),
        }
    }
}

interface ComponentScalar {
    n: number,
    t: number,
}