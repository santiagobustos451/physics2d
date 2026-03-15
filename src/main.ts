import { GraphicsEngine } from "./graphics/graphicsEngine";
import { PhysicsEngine } from "./simulation/physicsEngine";
import { BodyType, ShapeType } from "./types/physicsBody";
import Vector2 from "./types/vector2";

(async () => {
  // Create Physics engine
  const physicsEngine = new PhysicsEngine();

  // Create a new application
  const app = new GraphicsEngine(physicsEngine);

  // Initialize the application
  await app.init({ background: "#ccc", resizeTo: window, antialias: true });

  console.log(app.canvas);

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const button = document.getElementById("button")!;

  button.addEventListener("click", () => {
    console.log("clicked the thingy");
    physicsEngine.addBody({
      type: BodyType.dynamic,
      shape: { type: ShapeType.circle, radius: Math.random() * 30 + 10 },
      position: new Vector2(
        Math.random() * 200 + 200,
        Math.random() * 200 + 200,
      ),
      rotation: 0,
      angularVelocity: 0,
      linearVelocity: new Vector2(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      ),
      density: 1,
      elasticity: 1,
    });
  });

  // Listen for animate update
  app.ticker.add((time) => {
    physicsEngine.step(time.deltaTime);
    app.render();
  });
})();
