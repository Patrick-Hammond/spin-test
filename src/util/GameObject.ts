import { Container } from 'pixi.js';

export abstract class GameObject {
  protected root = new Container();

  public getRoot(): Container {
    return this.root as Container;
  }

  public addChild(child: GameObject): void {
    this.root.addChild(child.getRoot());
  }
  public abstract init(): void;
}