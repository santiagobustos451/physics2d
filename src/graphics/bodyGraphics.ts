import { Graphics } from "pixi.js";
import { PhysicsBody, ShapeType } from "../types/physicsBody";

export class BodyGraphics extends Graphics {
  public bodyId: string;

  constructor(bodyId: string) {
    super();
    this.bodyId = bodyId;
  }

  public build(body: PhysicsBody) {
    switch (body.shape.type) {
      case ShapeType.circle:
        this.circle(0, 0, body.shape.radius);
        break;
      case ShapeType.polygon:
        this.poly(body.shape.vertices);
        break;
    }

    this.stroke({ width: 5, color: "#222" });
    this.fill("#eee");
  }

  public update(body: PhysicsBody) {
    this.x = body.position.x;
    this.y = body.position.y;
  }
}
