import { ImageKeys, SoundKeys } from "../config/";
import { getSpinButton, getSound, getSprite, GameObject } from "../util/";
import { Reels } from "./reels/Reels";

export class SpinTest extends GameObject {
  public init(): void {

    //make some reels
    const reels = new Reels(5);
    reels.init();

    //and a spin button
    const spinButton = getSpinButton(()=> reels.spin());
    spinButton.position.set(1300, 350);

    //add everything to the display list
    this.root.addChild(
      getSprite(ImageKeys.REELS_BACKGROUND),
      reels.getRoot(),
      getSprite(ImageKeys.OVERLAY),
      spinButton
    );

    //play some background music
    const music = getSound(SoundKeys.MAIN_GAME_BACKGROUND);
    music.loop = true;
    music.play();
  }
}
