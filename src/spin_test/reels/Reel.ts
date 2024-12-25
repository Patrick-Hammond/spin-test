import { Sprite, Ticker } from "pixi.js";
import { reelGap, symbolHeight, symbolWidth } from "../../config/Constants";
import { SymbolName } from "../../config/Symbols";
import { getSymbolSprite, getSymbolTexture } from "../../util/AssetFactory";
import { GameObject } from "../../util/GameObject";
import { lerp } from "../../util/Math";

enum ReelState {
  IDLE,
  STARTING,
  SPINNING,
  STOPPING
}

export class Reel extends GameObject {

  private index: number = 0;
  private speed: number = 0.1;
  private progress: number = 0;
  private symbolSprites: Sprite[] = [];
  private state: ReelState = ReelState.IDLE;
  constructor(
    private reelIndex: number, 
    private reelStrip: SymbolName[]){
    super();
  }
  public init(): void {
    //create a strip of 8 symbols (1 above and 3 below the visible area)
    for (let i = 0; i < 8; i++) {
      const symbolSprite = getSymbolSprite(this.reelStrip[i]);
      symbolSprite.y = (i - 1) * symbolHeight;
      this.symbolSprites.push(symbolSprite);
    }
    this.getRoot().addChild(...this.symbolSprites);

    this.getRoot().x = this.reelIndex * (symbolWidth + reelGap);
  }

  public spin(): void {
    this.speed = 0.1;
    this.progress = 0;
    this.state = ReelState.STARTING;
    Ticker.shared.add(this.update, this);
  }

  public stop(): void {

  }

  private update(ticker: Ticker): void {
    switch (this.state) {
      case ReelState.STARTING:
        this.windUpReel(ticker);
        break;
      case ReelState.SPINNING:
        this.spinReel(ticker);
        break;
      case ReelState.STOPPING:
        this.stopReel(ticker);
        break;
    }
  }

  private windUpReel(ticker: Ticker): void {
    this.progress += ticker.deltaMS * 0.01;
    this.getRoot().y = lerp(0, -60, this.progress);
    if (this.progress >= 1) {
      this.state = ReelState.SPINNING;
    }
  }

  private spinReel(ticker: Ticker): void {
    this.symbolSprites.forEach((symbolSprite) => {
      //move the symbol down
      symbolSprite.y += ticker.deltaMS * this.speed;
      //accelerate
      if (this.speed < 10) this.speed += 0.05;

      //if the symbol is off the bottom of the screen, move it to the top
      if (symbolSprite.y > 7 * symbolHeight) {
        symbolSprite.y = -symbolHeight;
        //change the symbol according to the reel strip
        if (--this.index < 0) this.index = this.reelStrip.length - 1;
        (symbolSprite as Sprite).texture = getSymbolTexture(this.reelStrip[this.index], this.speed > 3);
      }
    });
  }
  private stopReel(ticker: Ticker): void {
    this.progress += ticker.deltaMS * 0.005;
    this.getRoot().y = lerp(0, 80, this.progress);
    if (this.progress >= 1) {
      this.state = ReelState.SPINNING;
    }
  }
}