// shared/career.js — persisted ladder progress (owner: PD). Only the index and the champion flag are stored;
// the roster names and scaling live in game/roster.js. Reads and writes never throw (blocked storage = start over).

import { CAREER_STORAGE_KEY } from './constants.js';

function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** @returns {{index:number, champion:boolean}} */
export function loadCareer(storage = defaultStorage()) {
  try {
    const raw = storage?.getItem(CAREER_STORAGE_KEY);
    if (!raw) return { index: 0, champion: false };
    const c = JSON.parse(raw);
    return { index: Number.isInteger(c?.index) ? c.index : 0, champion: !!c?.champion };
  } catch {
    return { index: 0, champion: false };
  }
}

export function saveCareer({ index, champion }, storage = defaultStorage()) {
  try {
    if (!storage) return false;
    storage.setItem(CAREER_STORAGE_KEY, JSON.stringify({ index: index | 0, champion: !!champion }));
    return true;
  } catch {
    return false;
  }
}
