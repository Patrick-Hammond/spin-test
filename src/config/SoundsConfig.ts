export enum SoundKeys {
  MAIN_GAME_BACKGROUND = "MAIN_GAME_BACKGROUND",
  REELS_STOP = "REELS_STOP",
  UI_SPIN_BUTTON = "UI_SPIN_BUTTON"
}

export function getSoundFilename(name: SoundKeys): string {
  return sounds[name];
}

export function getAllSoundFilenames(): string[] {
  return Object.values(sounds);
}

const sounds: Record<SoundKeys, string> = {
  [SoundKeys.MAIN_GAME_BACKGROUND]: "assets/sounds/maingame_backgroundmusic.ogg",
  [SoundKeys.REELS_STOP]: "assets/sounds/reels_stop_1.ogg",
  [SoundKeys.UI_SPIN_BUTTON]: "assets/sounds/ui_spinbutton.ogg"
};