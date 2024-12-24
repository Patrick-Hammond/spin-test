export enum SoundKeys {
    MAIN_GAME_BACKGROUND = "MAIN_GAME_BACKGROUND",
    REELS_STOP_1 = "REELS_STOP_1",
    REELS_STOP_2 = "REELS_STOP_2",
    REELS_STOP_3 = "REELS_STOP_3",
    REELS_STOP_4 = "REELS_STOP_4",
    REELS_STOP_5 = "REELS_STOP_5",
    UI_SPIN_BUTTON = "UI_SPIN_BUTTON"
}

export function getSoundFilename(name: SoundKeys): string {
  return sounds[name];
}

export function getAllSoundFilenames(): string[] {
  return Object.values(sounds);
}

const sounds: Record<SoundKeys, string> = {
    [SoundKeys.MAIN_GAME_BACKGROUND]: "../assets/sounds/maingame_backgroundmusic.ogg",
    [SoundKeys.REELS_STOP_1]: "../assets/sounds/reels_stop_1.ogg",
    [SoundKeys.REELS_STOP_2]: "../assets/sounds/reels_stop_2.ogg",
    [SoundKeys.REELS_STOP_3]: "../assets/sounds/reels_stop_3.ogg",
    [SoundKeys.REELS_STOP_4]: "../assets/sounds/reels_stop_4.ogg",
    [SoundKeys.REELS_STOP_5]: "../assets/sounds/reels_stop_5.ogg",
    [SoundKeys.UI_SPIN_BUTTON]: "../assets/sounds/ui_spinbutton.ogg"
};