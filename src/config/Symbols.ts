export enum SymbolName {
  SYMBOL_10 = "symbol_10",
  SYMBOL_J = "symbol_J",
  SYMBOL_Q = "symbol_Q",
  SYMBOL_K = "symbol_K",
  SYMBOL_A = "symbol_A",
  SYMBOL_WILD = "symbol_wild",
  SYMBOL_ANUBIS = "symbol_anubis",
  SYMBOL_BASTET = "symbol_bastet",
  SYMBOL_HORUS = "symbol_horus",
  SYMBOL_CLEO = "symbol_cleo",
  SYMBOL_OSIRIS = "symbol_osiris",
  SYMBOL_EMPTY = "symbol_empty",
}

export const SymbolNames = Object.values(SymbolName);

export function createReelStrip(length: number): SymbolName[] {

  const reelStrip: SymbolName[] = [];

  //add royals
  for (let i = 0; i < length; i++) {
    reelStrip.push(SymbolNames[Math.floor(Math.random() * 5)]);
  }

  //add wilds
  for (let i = 0; i < length; i++) {
    if(Math.random() < 0.1) {
      reelStrip[i] = SymbolName.SYMBOL_WILD;
    }
  }

  //add specials
  for (let i = 2; i < length; i+=3) {
    if(Math.random() < 0.1) {
      reelStrip[i] = SymbolNames[6 + Math.floor(Math.random() * 5)];
      reelStrip[i - 1] = SymbolName.SYMBOL_EMPTY;
      reelStrip[i - 2] = SymbolName.SYMBOL_EMPTY;
    }
  }
  return reelStrip;
}

export function createStopResult(): SymbolName[][] {
  const result: SymbolName[][] = [];
  for (let i = 0; i < 5; i++) {
    result.push(createReelStrip(7));
  }
  return result;
}