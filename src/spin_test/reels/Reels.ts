import { SoundKeys } from "../../config/SoundsConfig";
import { SymbolName, SymbolNames } from "../../config/Symbols";
import { getSound } from "../../util/AssetFactory";
import { GameObject } from "../../util/GameObject";
import { Reel } from "./Reel";

export class Reels extends GameObject {
  private reels: Reel[] = [];
  private isSpinning: boolean = false;
  constructor(
    private reelCount: number) {
    super();
  }

  public init() {
    for (let i = 0; i < this.reelCount; i++) {
      const reel = new Reel(i, this.createReelStrip(80));
      this.reels.push(reel);
      this.addChild(reel);
      reel.init();
    }

    this.getRoot().position.set(288, 97);
  }

  public spin(): void {
    if (!this.isSpinning) {
      this.isSpinning = true;
      getSound(SoundKeys.UI_SPIN_BUTTON).play();
      this.reels.forEach(reel => reel.spin());
    }
  }

  public stop(): void {
    this.reels.forEach(reel => reel.stop());
  }

  private createReelStrip(length: number): SymbolName[] {

    const reelStrip: SymbolName[] = [];

    //add royals and wilds
    for (let i = 0; i < length; i++) {
      reelStrip.push(SymbolNames[Math.floor(Math.random() * 6)]);
    }

    //add specials
    for (let i = 2; i < length; i+=3) {
      if(Math.random() < 0.1) {
        reelStrip[i] = SymbolNames[6 + Math.floor(Math.random() * 5)];
        reelStrip[i - 1] = SymbolName.SYMBOL_EMPTY;
        reelStrip[i - 2] = SymbolName.SYMBOL_EMPTY;
      }
    }
    return reelStrip;
  }
}