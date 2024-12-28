import { Container } from "pixi.js";
import { lerp } from "../../../util/Math";
import { AbstractState } from "../../../util/StateMachine";
import { ReelState } from "./ReelState";

export class ReelState4_Bouncing extends AbstractState<ReelState> {

  private time: number = 0;

  constructor(
    private reel: Container,
    private onComplete: () => void,
  ) { 
    super();
  }

  public enter(): void {
    this.time = 0;
  }

  public update(deltaTime: number): void {

    this.time += deltaTime * 0.02;
    if (this.time <= 1) {
      this.reel.y = lerp(0, 50, this.time);
    } else {
      this.reel.y = lerp(50, 0, this.time - 1);
    }
    if (this.time >= 2) {
      this.reel.y = 0;
      this.stateMachine.changeState(ReelState.IDLE);
      this.onComplete();
    }
  }
}