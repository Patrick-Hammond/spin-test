export enum ImageKeys {
  OVERLAY = "OVERLAY",
  REELS_BACKGROUND = "REELS_BACKGROUND",
  SPIN_BUTTON = "SPIN_BUTTON",
  SYMBOLS = "SYMBOLS",
}

export function getImageFilename(name: ImageKeys): string {
  return images[name];
}

export function getAllImageFilenames(): string[] {
  return Object.values(images);
}

const images: Record<ImageKeys, string> = {
  [ImageKeys.OVERLAY]: "../assets/images/overlay.png",
  [ImageKeys.REELS_BACKGROUND]: "../assets/images/reels_back.png",
  [ImageKeys.SPIN_BUTTON]: "../assets/images/spin.png",
  [ImageKeys.SYMBOLS]: "../assets/images/symbols_definition.json"
};