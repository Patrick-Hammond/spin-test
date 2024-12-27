import { SymbolName, createReelStrip, createStopResult } from "../../config/Symbols";
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
    //create all reels with random reel symbols
    for (let i = 0; i < this.reelCount; i++) {
      const reelStrip: SymbolName[] = [];
      const reel = new Reel(i, createReelStrip(reelStrip, 80));
      this.reels.push(reel);
      this.addChild(reel);
      reel.init();
    }

    this.getRoot().position.set(288, 97);
  }

  public spin(): void {
    if (this.state === ReelsState.IDLE) {

      //spin all
      this.state = ReelsState.SPINNING;
      this.reels.forEach(reel => reel.spin());

      //for the purposes of this demo, let's just stop the
      //reels after a fixed duration
      setTimeout(() => this.stop(createStopResult()), 3000);
    }
  }

  public async stop(spinResult: SymbolName[][]): Promise<void> {

    const stopPromises =
      this.reels.map((reel, index) => reel.stop(spinResult[index], index * 200));
    await Promise.all(stopPromises);

    //wait for all reels to stop
    this.state = ReelsState.IDLE;
  }
}