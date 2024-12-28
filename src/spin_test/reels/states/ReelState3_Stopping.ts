import { Container } from "pixi.js";
import { maxReelSpeed, symbolHeight } from "../../../config/Constants";
import { SoundKeys } from "../../../config/SoundsConfig";
import { getSound } from "../../../util/AssetFactory";
import { AbstractState } from "../../../util/StateMachine";
import { ReelState } from "./ReelState";

export class ReelState3_Stopping extends AbstractState<ReelState> {

  constructor(
    private reel: Container,
    private updateLandingSymbolTexture: () => void,
  ) {
    super();
   }

  public update(deltaTime: number): void {

    this.reel.y += deltaTime * maxReelSpeed;

    if (this.reel.y >= symbolHeight) {
      this.reel.y = 0;
      this.updateLandingSymbolTexture();
    }
  }

  public exit(): void {
    getSound(SoundKeys.REELS_STOP).play();
  }
}