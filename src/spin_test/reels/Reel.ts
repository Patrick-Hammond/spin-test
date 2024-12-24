import { Sprite } from "pixi.js";
import { GameObject } from "../../util/GameObject";
import { reelGap, symbolWidth } from "../../config/Constants";

export class Reel extends GameObject {

  private symbols: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  constructor(private index:number) {
    super();
  }
    public init(): void {
      this.getRoot().x = this.index * (symbolWidth + reelGap);
      const sp = Sprite.from("character_1");
      this.getRoot().addChild(sp);
    }

    public spin(): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, this.index * 1000);
      });
    }
}