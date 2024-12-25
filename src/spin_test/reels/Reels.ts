import { SoundKeys } from "../../config/SoundsConfig";
import { SymbolName, createReelStrip, createStopResult } from "../../config/Symbols";
import { getSound } from "../../util/AssetFactory";
import { GameObject } from "../../util/GameObject";
import { Reel } from "./Reel";

enum ReelsState {
  IDLE,
  SPINNING,
  STOPPING
}

export class Reels extends GameObject {
  private reels: Reel[] = [];
  private state: ReelsState = ReelsState.IDLE;
  constructor(
    private reelCount: number) {
    super();
  }

  public init() {
    for (let i = 0; i < this.reelCount; i++) {
      const reel = new Reel(i, createReelStrip(80));
      this.reels.push(reel);
      this.addChild(reel);
      reel.init();
    }

    this.getRoot().position.set(288, 97);
  }

  public spin(): void {
    if (this.state === ReelsState.IDLE) {
      this.state = ReelsState.SPINNING;
      getSound(SoundKeys.UI_SPIN_BUTTON).play();
      this.reels.forEach(reel => reel.spin());
      setTimeout(() => this.stop(createStopResult()), 4000);
    }
  }

  public async stop(spinResult: SymbolName[][]): Promise<void> {
    const stopPromises = this.reels.map((reel, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          await reel.stop(spinResult[index]);
          resolve();
        }, index * 300);
      });
    });

    await Promise.all(stopPromises);
    this.state = ReelsState.IDLE;
  }

}