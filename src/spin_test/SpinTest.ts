import { ImageKeys } from "../config/ImagesConfig";
import { getButton, getSprite } from "../util/AssetFactory";
import { GameObject } from "../util/GameObject";
import { Reels } from "./reels/Reels";

export class SpinTest extends GameObject {
  public init(): void {

    //make some reels
    const reels = new Reels(5);
    reels.init();

    //and a spin button
    const spinButton = getButton(ImageKeys.SPIN_BUTTON);
    spinButton.on('pointerdown', () => reels.spin());

    //add them to the display list
    this.root.addChild(
      getSprite(ImageKeys.REELS_BACKGROUND),
      reels.getRoot(),
      getSprite(ImageKeys.OVERLAY),
      spinButton
    );
  }
}