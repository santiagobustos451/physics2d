import { Application, ApplicationOptions } from "pixi.js";
import { BodyGraphics } from "./bodyGraphics";
import { PhysicsEngine } from "../simulation/physicsEngine";

export class GraphicsEngine extends Application {
  public bodyGraphics: Map<string, BodyGraphics> = new Map();
  public physics: PhysicsEngine;

  constructor(physics: PhysicsEngine) {
    super();
    this.physics = physics;
  }

  public async init(opts: Partial<ApplicationOptions>): Promise<void> {
    await super.init(opts);
  }

  public render() {
    for (const [id, body] of this.physics.bodies) {
      let bodyGraphic = this.bodyGraphics.get(id);

      if (!bodyGraphic) {
        bodyGraphic = new BodyGraphics(id);
        bodyGraphic.build(body);
        this.bodyGraphics.set(id, bodyGraphic);
        this.stage.addChild(bodyGraphic);
      }

      bodyGraphic.update(body);
    }
    super.render();
  }
}
