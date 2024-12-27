export enum ImageKeys {
  OVERLAY = "OVERLAY",
  REELS_BACKGROUND = "REELS_BACKGROUND",
  SPIN_BUTTON = "SPIN_BUTTON"
}

export function getImageFilename(name: ImageKeys): string {
  return images[name];
}

export function getAllImageFilenames(): string[] {
  return Object.values(images);
}

export const spritesheet: string = "/dist/assets/images/symbols_definition.json";

const images: Record<ImageKeys, string> = {
  [ImageKeys.OVERLAY]: "/dist/assets/images/overlay.png",
  [ImageKeys.REELS_BACKGROUND]: "/dist/assets/images/reels_back.png",
  [ImageKeys.SPIN_BUTTON]: "/dist/assets/images/spin.png"
};