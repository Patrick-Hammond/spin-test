
import { Sprite, Texture } from "pixi.js";
import { Sound } from "@pixi/sound";
import { ImageKeys, getImageFilename } from "../config/ImagesConfig";
import { SoundKeys, getSoundFilename } from "../config/SoundsConfig";
import { SymbolNames, SymbolName } from "../config/Symbols";

export function getSprite(name: ImageKeys): Sprite {
  return Sprite.from(getImageFilename(name));
}

export function getButton(name: ImageKeys): Sprite {
  const button = getSprite(name);
  button.interactive = true;
  return button;
}

export function getSound(name: SoundKeys): Sound {
  return Sound.from(getSoundFilename(name));
}

export function getSymbolSprite(name: SymbolName): Sprite {
  const symbolSprite = Sprite.from(name);
  symbolSprite.anchor.set(0, 1);
  return symbolSprite;
}

export function getSymbolTexture(name: SymbolName, blur: boolean = false): Texture {
  return Texture.from(blur ? name + "_blurred" : name);
}

export function getSymbolSpriteByIndex(index: number): Sprite {
  return getSymbolSprite(SymbolNames[index]);
}