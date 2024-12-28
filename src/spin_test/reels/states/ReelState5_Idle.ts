import { AbstractState } from "../../../util/StateMachine";
import { ReelState } from "./ReelState";

export class ReelState5_Idle extends AbstractState<ReelState> {
  public enter(): void {
    this.stateMachine.stopUpdates();
  }
}