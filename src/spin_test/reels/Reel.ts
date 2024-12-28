import { Container, Sprite } from "pixi.js";
import { reelGap, symbolHeight, symbolWidth } from "../../config/Constants";
import { SymbolName } from "../../config/Symbols";
import { getSymbolSprite, getSymbolTexture } from "../../util/AssetFactory";
import { GameObject } from "../../util/GameObject";
import { StateMachine } from "../../util/StateMachine";
import { ReelState } from "./states/ReelState";
import { ReelState4_Bouncing } from "./states/ReelState4_Bouncing";
import { ReelState2_Spinning } from "./states/ReelState2_Spinning";
import { ReelState1_Startup } from "./states/ReelState1_Startup";
import { ReelState5_Idle } from "./states/ReelState5_Idle";
import { ReelState3_Stopping } from "./states/ReelState3_Stopping";

export class Reel extends GameObject {
  private reel: Container = new Container();
  private stateMachine: StateMachine<ReelState> = new StateMachine<ReelState>();
  private landingSymbols: SymbolName[] = [];
  private nextSymbolIndex: number = 0;
  private symbolSprites: Sprite[] = [];
  private onComplete: () => void = () => { };
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

    //setup states
    this.stateMachine.setStates({
      [ReelState.STARTING]: new ReelState1_Startup(this.reel),
      [ReelState.SPINNING]: new ReelState2_Spinning(this.reel, (speed: number) => this.updateSymbolTexture(speed)),
      [ReelState.STOPPING]: new ReelState3_Stopping(this.reel, () => this.updateLandingSymbolTexture()),
      [ReelState.BOUNCE]:   new ReelState4_Bouncing(this.reel,   () => this.onComplete()),
      [ReelState.IDLE]:  new ReelState5_Idle()
    });
  }

  public spin(): void {
    this.stateMachine.changeState(ReelState.STARTING);
  }

  public stop(landingSymbols: SymbolName[], startDelayMS: number): Promise<void> {
    this.landingSymbols = landingSymbols;
    //this.logLandingSymbols(landingSymbols);
    setTimeout(() => {
      this.stateMachine.changeState(ReelState.STOPPING);
    }, startDelayMS);
    return new Promise<void>(resolve => this.onComplete = resolve);
  }

  private updateSymbolTexture(speed: number): void {
    // Change the symbol according to the reel strip
    // cascade the textures first and then set the first sprite's texture
    this.cascadeSymbolTextures();
    if (--this.nextSymbolIndex < 0) this.nextSymbolIndex = this.reelStrip.length - 1;
    this.symbolSprites[0].texture = getSymbolTexture(this.reelStrip[this.nextSymbolIndex], speed > 3);
  }

  private updateLandingSymbolTexture(): void {
    // Change the symbol according to the landing symbols
    // in this case we want to cascade the textures AFTER updating top symbolSprite
    this.symbolSprites[0].texture = getSymbolTexture(this.landingSymbols.pop() as SymbolName, false);
    this.cascadeSymbolTextures();
    if (this.landingSymbols.length === 0) {
      this.stateMachine.changeState(ReelState.BOUNCE);
    }
  }

  private cascadeSymbolTextures(): void {
    //copy texture references from symbolSprite 0 -> 1, 1 -> 2 etc.. 
    for (let i = this.symbolSprites.length - 1; i > 0; i--) {
      this.symbolSprites[i].texture = this.symbolSprites[i - 1].texture;
    }
  }

  private logLandingSymbols(landingSymbols: string[]): void {
    console.log(`Reel ${this.reelIndex} landing symbols: ${landingSymbols.slice(1, 4).join(", ")}`);
  }
}