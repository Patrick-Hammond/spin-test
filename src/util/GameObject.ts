import { Container } from 'pixi.js';

export abstract class GameObject {
  protected root = new Container();

  public getRoot(): Container {
    return this.root as Container;
  }

  public abstract init(): void;
}