import { Sprite, Ticker } from "pixi.js";
import { maxReelSpeed, reelGap, symbolHeight, symbolWidth } from "../../config/Constants";
import { SymbolName } from "../../config/Symbols";
import { getSymbolSprite, getSymbolTexture } from "../../util/AssetFactory";
import { GameObject } from "../../util/GameObject";
import { lerp } from "../../util/Math";

enum ReelState {
  IDLE,
  STARTING,
  SPINNING,
  STOPPING,
  BOUNCE,
  STOPPED
}

export class Reel extends GameObject {

  private index: number = 0;
  private speed: number = 0.1;
  private progress: number = 0;
  private onComplete: () => void = () => { };
  private symbolSprites: Sprite[] = [];
  private state: ReelState = ReelState.IDLE;
  private landingSymbols: SymbolName[] = [];
  constructor(
    private reelIndex: number,
    private reelStrip: SymbolName[]) {
    super();
  }
  public init(): void {
    //create a strip of 7 symbols (1 above and 3 below the visible area)
    for (let i = 0; i < 7; i++) {
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

  public async stop(landingSymbols: SymbolName[]): Promise<void> {
    console.log("landingSymbols", landingSymbols);
    this.landingSymbols = [...landingSymbols];
    this.progress = 0;
    this.state = ReelState.STOPPING;
    return new Promise<void>(resolve => this.onComplete = resolve);
  }

  private update(ticker: Ticker): void {
    switch (this.state) {
      case ReelState.STARTING:
        this.startReel(ticker);
        break;
      case ReelState.SPINNING:
        this.spinReel(ticker);
        break;
      case ReelState.STOPPING:
        this.stopReel(ticker);
        break;
      case ReelState.BOUNCE:
        this.bounceReel(ticker);
        break;
    }
  }

  private moveSymbols(ticker: Ticker): void {
    this.symbolSprites.forEach((symbolSprite) => {

      //move the symbol down
      symbolSprite.y += ticker.deltaMS * this.speed;

      //if the symbol is off the bottom of the screen, move it to the top
      if (symbolSprite.y >= 6 * symbolHeight) {
        symbolSprite.y -= 7 * symbolHeight;

        this.updateSymbolTexture(symbolSprite);
      }
    });
  }

  private updateSymbolTexture(symbolSprite: Sprite): void {
    switch (this.state) {
      case ReelState.SPINNING:
        // Change the symbol according to the reel strip
        if (--this.index < 0) this.index = this.reelStrip.length - 1;
        symbolSprite.texture = getSymbolTexture(this.reelStrip[this.index], this.speed > 3);
        break;
      case ReelState.STOPPING:
        // Change the symbol according to the landing symbols
        symbolSprite.texture = getSymbolTexture(this.landingSymbols.pop() as SymbolName, false);
        if (this.landingSymbols.length === 0) {
          this.getRoot().y = 0;
          this.state = ReelState.STOPPED;
          this.onComplete();
        }
        break;
    }
  }

  private startReel(ticker: Ticker): void {
    this.progress += ticker.deltaMS * 0.01;
    this.getRoot().y = lerp(0, -60, this.progress);
    if (this.progress >= 1) {
      this.state = ReelState.SPINNING;
    }
  }

  private spinReel(ticker: Ticker): void {
    this.moveSymbols(ticker);
    //accelerate the reel
    if (this.speed < maxReelSpeed) {
      this.speed += ticker.deltaMS * 0.016;
    } else {
      this.speed = maxReelSpeed;
    }
  }

  private stopReel(ticker: Ticker): void {
    this.moveSymbols(ticker);
    //deccelerate the reel
    if (this.speed > 1) {
      this.speed -= ticker.deltaMS * 0.05;
    } else {
      this.speed = 1;
    }
  }


  private bounceReel(ticker: Ticker): void {
    this.progress += ticker.deltaMS * 0.005;
    this.getRoot().y = lerp(0, 80, this.progress);
    if (this.progress >= 1) {
      this.state = ReelState.STOPPED;
      this.onComplete();
    }
  }
}