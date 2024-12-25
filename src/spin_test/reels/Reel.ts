import { Container, Sprite, Texture, TextureSource, Ticker } from "pixi.js";
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
  private reel: Container = new Container();
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
      symbolSprite.y = i * symbolHeight;
      this.symbolSprites.push(symbolSprite);
    }
    this.reel.addChild(...this.symbolSprites);

    this.getRoot().addChild(this.reel);
    this.getRoot().position.set(this.reelIndex * (symbolWidth + reelGap), -symbolHeight);
  }

  public spin(): void {
    this.speed = 0.1;
    this.progress = 0;
    this.state = ReelState.STARTING;
    Ticker.shared.add(this.update, this);
  }

  public async stop(landingSymbols: SymbolName[]): Promise<void> {
    this.landingSymbols = landingSymbols;
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

  private moveReel(ticker: Ticker): void {
      this.reel.y += ticker.deltaMS * this.speed;

      if (this.reel.y >= symbolHeight) {
        this.reel.y = 0;
        for (let i = this.symbolSprites.length - 1; i > 0; i--) {
          this.symbolSprites[i].texture = this.symbolSprites[i-1].texture;
        }
        this.updateSymbolTexture(this.symbolSprites[0]);
      }
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
          this.state = ReelState.STOPPED;
          Ticker.shared.remove(this.update, this);
          this.onComplete();
        }
        break;
    }
  }

  private startReel(ticker: Ticker): void {
    this.progress += ticker.deltaMS * 0.025;
    this.reel.y = lerp(0, -60, this.progress);
    if (this.progress >= 1) {
      this.state = ReelState.SPINNING;
    }
  }

  private spinReel(ticker: Ticker): void {
    this.moveReel(ticker);
    //accelerate the reel
    if (this.speed < maxReelSpeed) {
      this.speed += ticker.deltaMS * 0.016;
    } else {
      this.speed = maxReelSpeed;
    }
  }

  private stopReel(ticker: Ticker): void {
    this.moveReel(ticker);
    //deccelerate the reel
    if (this.speed > 1) {
      this.speed -= ticker.deltaMS * 0.03;
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