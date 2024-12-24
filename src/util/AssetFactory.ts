
import { Sprite } from "pixi.js";
import { Sound } from "@pixi/sound";
import { ImageKeys, getImageFilename } from "../config/ImagesConfig";
import { SoundKeys, getSoundFilename } from "../config/SoundsConfig";

export function getSprite(name: ImageKeys): Sprite {
    return Sprite.from(getImageFilename(name));
}

export function getButton(name: ImageKeys): Sprite {
  const button = Sprite.from(getImageFilename(name));
  button.interactive = true;
  return button;
}

export function getSound(name: SoundKeys): Sound {
  return Sound.from(getSoundFilename(name));
}