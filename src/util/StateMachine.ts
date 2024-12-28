import { Ticker } from "pixi.js";

export abstract class AbstractState<T extends number> {
  private _stateMachine: StateMachine<T> | null = null;

  set stateMachine(stateMachine: StateMachine<T>) {
    this._stateMachine = stateMachine;
  }
  get stateMachine(): StateMachine<T> {
    if (!this._stateMachine) {
      throw new Error("State machine is not set");
    }
    return this._stateMachine;
  }

  enter?(): void { };
  update(deltaTime: number): void { };
  exit?(): void { };
}

export class StateMachine<T extends number> {
  private readonly states: Record<T, AbstractState<T>> = {} as Record<T, AbstractState<T>>;
  private currentState: AbstractState<T> | null = null;
  private readonly ticker: Ticker = new Ticker();

  constructor() {
    this.ticker.add((ticker: Ticker) => this.update(ticker.deltaMS));
  }

  setStates(states: Record<T, AbstractState<T>>): void {
    Object.assign(this.states, states);
  }

  startUpdates(): void {
    this.ticker.start();
  }

  stopUpdates(): void {
    this.ticker.stop();
  }

  changeState(newState: T): void {
    if (!this.states[newState]) {
      throw new Error(`State ${newState} does not exist in the state machine`);
    }

    this.currentState?.exit?.();
    this.currentState = this.states[newState];
    this.currentState.stateMachine = this;
    this.currentState.enter?.();
  }

  update(deltaTime: number): void {
    this.currentState?.update(deltaTime);
  }
}
