import { Ticker } from "pixi.js";

/**
 * Represents an abstract state in the state machine.
 */
export abstract class AbstractState<T extends number> {
  private _stateMachine: StateMachine<T> | null = null;

  set stateMachine(stateMachine: StateMachine<T>) {
    this._stateMachine = stateMachine;
  }

  get stateMachine(): StateMachine<T> {
    if (!this._stateMachine) {
      throw new Error("State machine is not set. Ensure that the state is added to a state machine before using it.");
    }
    return this._stateMachine;
  }

  enter?(): void {};
  update(deltaTime: number): void {};
  exit?(): void {};
}

/**
 * Represents a state machine to manage different states.
 * T represents an Enum of transition states.
 */
export class StateMachine<T extends number> {
  private readonly states: Record<T, AbstractState<T>> = {} as Record<T, AbstractState<T>>;
  private currentState: AbstractState<T> | null = null;
  private readonly ticker: Ticker = new Ticker();

  constructor() {
    this.ticker.add((ticker: Ticker) => this.update(ticker.deltaMS));
  }

  /**
   * Sets the states for the state machine.
   * @param states The states to be set.
   */
  setStates(states: Record<T, AbstractState<T>>): void {
    Object.assign(this.states, states);
  }

  /**
   * Starts the ticker updates.
   */
  startUpdates(): void {
    this.ticker.start();
  }

  /**
   * Stops the ticker updates.
   */
  stopUpdates(): void {
    this.ticker.stop();
  }

  /**
   * Changes the current state to the specified new state.
   * @param newState The new state to transition to.
   */
  changeState(newState: T): void {
    if (!this.states[newState]) {
      throw new Error(`State ${newState} does not exist in the state machine.`);
    }

    this.currentState?.exit?.();
    this.currentState = this.states[newState];
    this.currentState.stateMachine = this;
    this.currentState.enter?.();
  }

  /**
   * Updates the current state.
   * @param deltaTime The time elapsed since the last update.
   */
  update(deltaTime: number): void {
    this.currentState?.update(deltaTime);
  }
}
