import { Application, Assets } from 'pixi.js';
import { getAllImageFilenames, getAllSoundFilenames, spritesheet } from './config/';
import { SpinTest } from './spin_test/SpinTest';
import { fillTextureCache } from './util/AssetFactory';
 

(async () => {

  //init pixi
  const app = new Application();
  await app.init({ background: '#1099bb', width:1475, height:807 });

  document.body.appendChild(app.canvas);

  //load assets
  await Assets.load([
    ...getAllImageFilenames(),
    ...getAllSoundFilenames(),
    spritesheet
  ]);
  fillTextureCache();

  //start the game
  const spinTest = new SpinTest();
  app.stage.addChild(spinTest.getRoot());
  spinTest.init();
}
)();
