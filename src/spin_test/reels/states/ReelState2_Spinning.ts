import { Container } from "pixi.js";
import { maxReelSpeed, symbolHeight } from "../../../config/Constants";
import { AbstractState } from "../../../util/StateMachine";
import { ReelState } from "./ReelState";

// at first, I tried moving the symbol sprites rather the the whole reel
// but even after accounting for excess overrun, they would eventually drift in relative position
// also, i wanted to copy the original spin design from https://slotcatalog.com/en/slots/egyptian-marvel
// where the symbol position remain static as the reel spins
// I achieved this by moving the symbol's parent container and when it has moved a symbol height distance
// reset it back to the start and cascade all the symbol textures down
// lowering the Constants.maxReelSpeed value results in more traditional spinning

export class ReelState2_Spinning extends AbstractState<ReelState> {

  private speed: number = 0;

  constructor(
    private reel: Container,
    private updateSymbolTexture: (speed: number) => void,
  ) { 
    super();
  }

  public enter(): void {
    this.speed = 0;
  }

  public update(deltaTime: number): void {

    this.reel.y += deltaTime * this.speed;
    this.speed = Math.min(this.speed + deltaTime * 0.008, maxReelSpeed);

    if (this.reel.y >= symbolHeight) {
      this.reel.y = 0;
      this.updateSymbolTexture(this.speed);
    }
  }
}