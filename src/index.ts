import { Application, Assets } from 'pixi.js';
import { getAllImageFilenames } from './config/ImagesConfig';
import { getAllSoundFilenames } from './config/SoundsConfig';
import { SpinTest } from './spin_test/SpinTest';

(async () => {
  //init pixi
  const app = new Application();
  await app.init({ background: '#1099bb', resizeTo: window });

  document.body.appendChild(app.canvas);

  //load assets
  await Assets.load([...getAllImageFilenames(), ...getAllSoundFilenames()]);

  //start the game
  const spinTest = new SpinTest();
  app.stage.addChild(spinTest.getRoot());
  spinTest.init();
}
)();