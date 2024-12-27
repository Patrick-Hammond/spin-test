import { Container, Sprite, Ticker } from "pixi.js";
import { maxReelSpeed, reelGap, symbolHeight, symbolWidth } from "../../config/Constants";
import { SymbolName } from "../../config/Symbols";
import { getSound, getSymbolSprite, getSymbolTexture } from "../../util/AssetFactory";
import { GameObject } from "../../util/GameObject";
import { lerp, lerpExp } from "../../util/Math";
import { SoundKeys } from "../../config/SoundsConfig";

enum ReelState {
  IDLE,
  STARTING,
  SPINNING,
  STOPPING,
  BOUNCE,
  STOPPED
}

export class Reel extends GameObject {
  private reel: Container = new Container();
  private state: ReelState = ReelState.IDLE;
  private landingSymbols: SymbolName[] = [];
  private nextSymbolIndex: number = 0;
  private speed: number = 0.1;
  private time: number = 0;
  private symbolSprites: Sprite[] = [];
  private onComplete: () => void = () => {};
  constructor(
    private reelIndex: number,
    private reelStrip: SymbolName[]) {
    super();
  }
  public init(): void {
    // create a strip of 7 symbols, 1 above and 3 below the visible area
    // the 3 below are so the special symbols which are 3 symbols high can show
    // partially as they run off the reel
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
    this.speed = 0;
    this.time = 0;
    this.state = ReelState.STARTING;
    Ticker.shared.add(this.update, this);
  }

  public stop(landingSymbols: SymbolName[], startDelayMS: number): Promise<void> {
    this.landingSymbols = landingSymbols;
    //this.logLandingSymbols(landingSymbols);
    setTimeout(() => {
      this.time = 0;
      this.state = ReelState.STOPPING;
    }, startDelayMS);
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

  private startReel(ticker: Ticker): void {
    this.time += ticker.deltaMS * 0.009;
    this.reel.y = lerpExp(0, -70, this.time);
    if (this.time >= 1) {
      this.state = ReelState.SPINNING;
      if (this.reelIndex === 4) getSound(SoundKeys.UI_SPIN_BUTTON).play();
    }
  }

  private spinReel(ticker: Ticker): void {
    this.moveReel(ticker);
    if (this.speed < maxReelSpeed) {
      this.speed += ticker.deltaMS * 0.008;
    } else {
      this.speed = maxReelSpeed;
    }
  }

  private stopReel(ticker: Ticker): void {
    this.moveReel(ticker);
    if (this.speed > 1) {
      this.speed *= ticker.deltaMS * 0.95;
    } else {
      this.speed = 1;
    }
  }

  private bounceReel(ticker: Ticker): void {
    this.time += ticker.deltaMS * 0.02;
    if (this.time <= 1) {
      this.reel.y = lerp(0, 50, this.time);
    } else {
      this.reel.y = lerp(50, 0, this.time - 1);
    }
    if (this.time >= 2) {
      this.onSpinCompleted();
    }
  }

  private moveReel(ticker: Ticker): void {
    // at first, I tried moving the symbol sprites rather the the whole reel
    // but even after accounting for excess overrun, they would eventually drift in relative position
    // also, i wanted to copy the original spin design from https://slotcatalog.com/en/slots/egyptian-marvel
    // where the symbol position remain static as the reel spins
    // I achieved this by moving the symbol's parent container and when it has moved a symbol height distance
    // reset it back to the start and cascade all the symbol textures down
    // lowering the Constants.maxReelSpeed value results in more traditional spinning
    this.reel.y += ticker.deltaMS * this.speed;

    if (this.reel.y >= symbolHeight) {
      this.reel.y = 0;
      this.updateSymbolTexture(this.symbolSprites[0]);
    }
  }

  private updateSymbolTexture(symbolSprite: Sprite): void {
    switch (this.state) {
      case ReelState.SPINNING:
        // Change the symbol according to the reel strip
        // cascade the textures first and then set the first sprite's texture
        this.cascadeSymbolTextures();
        if (--this.nextSymbolIndex < 0) this.nextSymbolIndex = this.reelStrip.length - 1;
        symbolSprite.texture = getSymbolTexture(this.reelStrip[this.nextSymbolIndex], this.speed > 3);
        break;

      case ReelState.STOPPING:
        // Change the symbol according to the landing symbols
        // in this case we want to cascade the textures AFTER updating top symbolSprite
        symbolSprite.texture = getSymbolTexture(this.landingSymbols.pop() as SymbolName, false);
        this.cascadeSymbolTextures();
        if (this.landingSymbols.length === 0) {
          this.time = 0;
          this.state = ReelState.BOUNCE;
          getSound(SoundKeys.REELS_STOP).play();
        }
        break;
    }
  }

  private cascadeSymbolTextures(): void {
    //copy texture references from symbolSprite 0 -> 1, 1 -> 2 etc.. 
    for (let i = this.symbolSprites.length - 1; i > 0; i--) {
      this.symbolSprites[i].texture = this.symbolSprites[i - 1].texture;
    }
  }

  private onSpinCompleted(): void {
    Ticker.shared.remove(this.update, this);
    this.reel.y = 0;
    this.state = ReelState.STOPPED;
    this.onComplete();
  }
  
  private logLandingSymbols(landingSymbols: string[]): void {
    console.log(`Reel ${this.reelIndex} landing symbols: ${landingSymbols.slice(1, 4).join(", ")}`);
  }
}