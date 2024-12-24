import { Sprite, Ticker } from "pixi.js";
import { reelGap, symbolHeight, symbolWidth } from "../../config/Constants";
import { SymbolName } from "../../config/Symbols";
import { getSymbolSprite, getSymbolTexture } from "../../util/AssetFactory";
import { GameObject } from "../../util/GameObject";

export class Reel extends GameObject {

  private index: number = 0;
  private speed: number = 0.1;
  constructor(private reelIndex: number, private reelStrip: SymbolName[]) {
    super();
  }
  public init(): void {
    this.getRoot().x = this.reelIndex * (symbolWidth + reelGap);

    //create a strip of 8 symbols (1 above and 3 below the visible area)
    for (let i = 0; i < 8; i++) {
      const symbolSprite = getSymbolSprite(this.reelStrip[i]);
      symbolSprite.y = (i - 1) * symbolHeight;
      this.getRoot().addChild(symbolSprite);
    }
  }

  public spin(): void {
    this.speed = 0.1;
    Ticker.shared.add(this.update, this);
  }

  public stop(): void {

  }

  private update(ticker: Ticker): void {
    this.getRoot().children.forEach((symbolSprite) => {
      symbolSprite.y += ticker.deltaMS * this.speed;
      if(this.speed < 10) this.speed += 0.05;
      if (symbolSprite.y > 7 * symbolHeight) {
        symbolSprite.y = -symbolHeight;
        if (--this.index < 0) this.index = this.reelStrip.length - 1;
        (symbolSprite as Sprite).texture = getSymbolTexture(this.reelStrip[this.index], this.speed > 3);
      }
    });
  }
}