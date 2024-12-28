
import { Sound } from "@pixi/sound";
import { Sprite, Texture } from "pixi.js";
import { ImageKeys, getImageFilename } from "../config/ImagesConfig";
import { SoundKeys, getSoundFilename } from "../config/SoundsConfig";
import { SymbolName, SymbolNames } from "../config/Symbols";

export function getSprite(name: ImageKeys): Sprite {
  return Sprite.from(getImageFilename(name));
}

export function getSpinButton(clickCallback: () => void): Sprite {
  //quick and dirty button
  const button = getSprite(ImageKeys.SPIN_BUTTON);
  button.anchor.set(0.5);
  button.interactive = true;
  button.on("pointerenter", () => button.tint = 0x000044);
  button.on("pointerleave", () => {
    button.tint = 0xFFFFFF;
    button.scale.set(1);
  });
  button.on("pointerdown", () => button.scale.set(0.9));
  button.on('pointerup', () => {
    button.scale.set(1);
    clickCallback();
  });
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

export function fillTextureCache(): void {
  SymbolNames.forEach(name => getSymbolTexture(name, false));
  SymbolNames.forEach(name => getSymbolTexture(name, true));
}

export function getSymbolTexture(name: SymbolName, blur: boolean = false): Texture {
  const key = blur ? `${name}_blurred` : name;
  if (!symbolTextureCache.has(key)) {
    const texture = Texture.from(key);
    symbolTextureCache.set(key, texture);
  }
  return symbolTextureCache.get(key) as Texture;
}

const symbolTextureCache: Map<string, Texture> = new Map();