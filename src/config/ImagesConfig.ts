export enum ImageKeys {
    BACKGROUND = "BACKGROUND",
    REELS_BACKGROUND = "REELS_BACKGROUND",
    FRAME = "FRAME",
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
  [ImageKeys.BACKGROUND]: "../assets/images/bg.jpg",
  [ImageKeys.REELS_BACKGROUND]: "../assets/images/reels_back.png",
  [ImageKeys.FRAME]: "../assets/images/frame.png",
  [ImageKeys.SPIN_BUTTON]: "../assets/images/spin.png",
  [ImageKeys.SYMBOLS]: "../assets/images/symbols_definition.json"
};