import { Container } from "pixi.js";
import { AbstractState, lerpExp, getSound } from "../../../util/";
import { SoundKeys } from "../../../config/SoundsConfig";
import { ReelState } from "./ReelState";

export class ReelState1_Startup extends AbstractState<ReelState> {

  private time: number = 0;

  constructor(
    private reel: Container,
  ) {
    super();
  }

  public enter(): void {
    this.time = 0;
    this.stateMachine.startUpdates();
  }

  public update(deltaTime: number): void {
    this.time += deltaTime * 0.009;
    this.reel.y = lerpExp(0, -70, this.time);
    if (this.time >= 1) {
      this.stateMachine.changeState(ReelState.SPINNING);
    }
  }

  public exit(): void {
    getSound(SoundKeys.UI_SPIN_BUTTON).play();
  }
}
