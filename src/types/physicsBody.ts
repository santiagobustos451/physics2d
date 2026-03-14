import Vector2 from "../types/vector2";

export enum BodyType {
    static,dynamic,kinematic
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
    circle,polygon
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