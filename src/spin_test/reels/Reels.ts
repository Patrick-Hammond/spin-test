import { getSound } from "../../util/AssetFactory";
import { SoundKeys } from "../../config/SoundsConfig";
import { GameObject } from "../../util/GameObject";
import { Reel } from "./Reel";

export class Reels extends GameObject {
  private reels: Reel[] = [];
  private isSpinning: boolean = false;

  constructor(private reelCount: number) {
    super();
  }

  public init() {
    for(let i = 0; i < this.reelCount; i++) {
      const reel = new Reel(i);
      reel.init();
      this.reels.push(reel);
      this.getRoot().addChild(reel.getRoot());
    }

    this.getRoot().position.set(272, 97);
  }

    async spin() : Promise<void> {
      if(!this.isSpinning) {
        this.isSpinning = true;

        getSound(SoundKeys.UI_SPIN_BUTTON).play();

        await Promise.all(this.reels.map(reel => reel.spin()));

        this.isSpinning = false;
      }
    }

}