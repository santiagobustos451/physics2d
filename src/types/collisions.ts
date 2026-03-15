import { PhysicsBody } from "./physicsBody";
import Vector2 from "./vector2";

export interface CollisionManifold {
  normal: Vector2 | undefined;
  isColliding: boolean;
  penetration: number;
  a: PhysicsBody;
  b: PhysicsBody;
}
