// shared/features.js — shipped mechanics, with explicit feature subsets for tests and diagnostics.
// main.js builds ONE frozen object at boot and hands it to input (tuning gates + key bindings), the sim
// (createSim({features})) and the view (every InputFrame carries it as frame.features). Never read the URL elsewhere.

export const FEATURE_KEYS = Object.freeze(['uppercut', 'body', 'parry', 'rise', 'slip']);

/** @typedef {{uppercut:boolean, body:boolean, parry:boolean, rise:boolean, slip:boolean}} Features */

/**
 * @param {boolean} [enabled=true]   Enable all mechanics; false creates an empty feature set.
 * @returns {Readonly<Features>}
 */
export function createFeatures(enabled = true) {
  return Object.freeze(Object.fromEntries(FEATURE_KEYS.map((k) => [k, !!enabled])));
}

/**
 * Test/debug override (QA balance runs): exactly the listed keys on, the rest off. Unknown keys throw.
 * @param {string[]} keys
 */
export function createFeaturesFrom(keys) {
  const on = new Set(keys.map((k) => k.trim()).filter(Boolean));
  for (const k of on) if (!FEATURE_KEYS.includes(k)) throw new Error(`unknown feature "${k}" (known: ${FEATURE_KEYS.join(', ')})`);
  return Object.freeze(Object.fromEntries(FEATURE_KEYS.map((k) => [k, on.has(k)])));
}

/** Explicit empty feature set for isolated fixtures and tests. */
export const NO_FEATURES = createFeatures(false);
