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

export function createReelStrip(reelStrip: SymbolName[], length: number): SymbolName[] {

  const start = reelStrip.length;

  addRoyals(reelStrip, length);

  //add wilds
  for (let i = start; i < start + length; i++) {
    if (Math.random() < 0.1) {
      reelStrip[i] = SymbolName.SYMBOL_WILD;
    }
  }

  //add specials
  if (length > 2) {
    for (let i = start + 2; i < start + length; i += 3) {
      if (Math.random() < 0.2) {
        reelStrip[i] = SymbolNames[6 + Math.floor(Math.random() * 5)];
        reelStrip[i - 1] = SymbolName.SYMBOL_EMPTY;
        reelStrip[i - 2] = SymbolName.SYMBOL_EMPTY;
      }
    }
  }

  return reelStrip;
}

function addRoyals(reelStrip: SymbolName[], length: number): void {
  for (let i = 0; i < length; i++) {
    reelStrip.push(SymbolNames[Math.floor(Math.random() * 5)]);
  }
}

export function createStopResult(): SymbolName[][] {
  const result: SymbolName[][] = [];
  for (let i = 0; i < 5; i++) {
    const reelSymbols: SymbolName[] = [];

    // the landing symbols needs to be split,
    // a random royal above the visible area
    // then the actual result, 3 random symbols, including specials and wilds
    // and under them, below the visible area, 3 more dummy royals
    addRoyals(reelSymbols, 1);
    createReelStrip(reelSymbols, 3);
    addRoyals(reelSymbols, 3);

    result.push(reelSymbols);
  }
  return result;
}