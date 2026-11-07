// game/roster.js — the world-championship ladder (owner: GE). Pure data + scaling, no sim imports.
// Difficulty is 0..1; Tugboat sits at 0.80 (4th of 5, the 80th percentile) and is the baseline: her
// multipliers are exactly 1, so the tuning numbers and every existing balance figure still describe her.
// Earlier boxers telegraph longer, hit softer, recover slower and have less HP; the champion is the reverse.
//
// Each entry also carries a persona (who they are, how they look, how they sound) and a style (how they
// fight). Style is deliberately NOT tied to difficulty: the ladder climbs, the fight styles vary independently.
// Tugboat has `look: null` / `style: null` on purpose — she keeps the shipped model and the shipped AI mix.

export const TUG_DIFFICULTY = 0.8;
const SCALE_PER_POINT = 0.625; // at difficulty 1.0: ×1.125 HP / damage, ×0.875 windup / cooldown

/**
 * @typedef {Object} Persona
 * @property {string} pronouns
 * @property {string} record     ring record, shown on the result card
 * @property {string} bio        one line, shown on the practice card
 * @property {string} taunt      what they say when they win
 * @property {{pitch:number}} voice   multiplier on the synthesized voice (1 = Tugboat)
 * @property {Object|null} look  model overrides; null = the shipped Tugboat model
 * @property {Object} posture    idle-pose offsets read by view/opponent-anim.js
 */

export const ROSTER = Object.freeze([
  {
    id: 'pip',
    fullName: 'Pip “Half-Pint” Okafor',
    shortName: 'Pip',
    difficulty: 0.15,
    persona: {
      pronouns: 'he/him',
      styleLabel: 'Out-boxer',
      record: '12-9 (2 KO)',
      bio: 'Dockside featherweight. In and out before you can turn.',
      taunt: 'Too slow, friend.',
      voice: { pitch: 1.16 },
      look: {
        skin: 0x6b452f,
        hair: 0x17130f,
        hairStyle: 'buzz',
        burnBand: false,
        build: { height: 0.9, width: 0.86, bust: 0, shoulders: 0.96, chestX: 1, chestZ: 0.82, waistX: 0.96, hipsX: 0.94, jaw: 0.95 },
        palette: { top: 0x2c4a3a, topStripe: 0xd8cfa8, trunks: 0x1d2b26, boots: 0x211d1a, glove: 0xb23a2e, mitt: 0x8c1d1d },
      },
      posture: { lean: 0.02, bounce: 0.02, sway: 0.3, drop: 0.02, hands: 0.12, stance: 1.05, headPitch: 0.02 },
    },
    // out-boxer: the jab does the work, feints pull the counter, and he does not stand in the pocket
    style: {
      weights: { rope_snap: 68, swing_bridge: 24, anchor_drop: 8 },
      feintWeights: { swing_bridge: 70, anchor_drop: 30 },
      comboWeights: { snap_drop: 70, bridge_snap: 30, double_bridge: 0 },
    },
  },
  {
    id: 'rosa',
    fullName: 'Rosa “Razor” Delgado',
    shortName: 'Rosa',
    difficulty: 0.4,
    persona: {
      pronouns: 'she/her',
      styleLabel: 'Swarmer',
      record: '18-6 (11 KO)',
      bio: 'Never takes a step back. Comes at you in threes.',
      taunt: 'Where are you going?',
      voice: { pitch: 1.05 },
      look: {
        skin: 0xa86a45,
        hair: 0x1b1512,
        hairStyle: 'bun',
        burnBand: false,
        build: { height: 0.94, width: 1.04, bust: 1, hipsX: 1.05, waistX: 0.95 },
        palette: { top: 0x6d1f2c, topStripe: 0xcfa15a, trunks: 0x201a1c, boots: 0x241f1d, glove: 0xe7e2d4, mitt: 0x8c1d1d },
      },
      posture: { lean: 0.13, bounce: 0.06, sway: 0.12, drop: 0.03, hands: 0.02, stance: 1.12, headPitch: 0.15 },
    },
    // swarmer: hooks and short combos, pressure over the single shot
    style: {
      weights: { rope_snap: 42, swing_bridge: 46, anchor_drop: 12 },
      feintWeights: { swing_bridge: 75, anchor_drop: 25 },
      comboWeights: { snap_drop: 40, bridge_snap: 50, double_bridge: 10 },
    },
  },
  {
    id: 'kofi',
    fullName: 'Kofi “The Anvil” Mensah',
    shortName: 'Kofi',
    difficulty: 0.6,
    persona: {
      pronouns: 'he/him',
      styleLabel: 'Slugger',
      record: '24-3 (22 KO)',
      bio: 'A welder with a right hand like a dropped girder.',
      taunt: 'Stay down. It is kinder.',
      voice: { pitch: 0.84 },
      look: {
        skin: 0x4a2e20,
        hair: 0x201812,
        hairStyle: 'bald',
        burnBand: false,
        build: { height: 1.09, width: 1.12, bust: 0, shoulders: 1.1, chestX: 1.05, chestZ: 0.66, waistX: 1.12, hipsX: 0.9, jaw: 1.12, delts: 1.06 },
        palette: { top: 0x3a3f46, topStripe: 0xb96a32, trunks: 0x23201d, boots: 0x1d1a18, glove: 0x8f3126, mitt: 0x8c1d1d },
      },
      posture: { lean: 0.03, bounce: 0.012, sway: 0.09, drop: 0.01, hands: -0.14, stance: 1.16, headPitch: 0.0 },
    },
    // slugger: the overhead is the plan; everything else sets it up
    style: {
      weights: { rope_snap: 22, swing_bridge: 28, anchor_drop: 50 },
      feintWeights: { swing_bridge: 40, anchor_drop: 60 },
      comboWeights: { snap_drop: 25, bridge_snap: 60, double_bridge: 15 },
    },
  },
  {
    id: 'tamsin',
    fullName: 'Tamsin “Tugboat” Rourke',
    shortName: 'Tamsin',
    difficulty: TUG_DIFFICULTY,
    persona: {
      pronouns: 'she/her',
      styleLabel: 'Boxer-puncher',
      record: '31-4 (19 KO)',
      bio: 'Barge pilot. Nothing on this river hits harder.',
      taunt: 'Mind the wake!',
      voice: { pitch: 1 },
      look: null, // the shipped model: the baseline every other look is built against
      posture: null, // the shipped idle
    },
    style: null, // the shipped AI mix: the baseline every other style is measured against
  },
  {
    id: 'viktor',
    fullName: 'Viktor “Iron Tsar” Volkov',
    shortName: 'Viktor',
    difficulty: 1.0,
    persona: {
      pronouns: 'he/him',
      styleLabel: 'Boxer-puncher',
      record: '40-0 (28 KO)',
      bio: 'Six years unbeaten. He does not chase you.',
      taunt: 'The belt stays here.',
      voice: { pitch: 0.9 },
      look: {
        skin: 0xc9a184,
        hair: 0x2a2724,
        hairStyle: 'short',
        burnBand: false,
        build: { height: 1.07, width: 1.03, bust: 0, shoulders: 1.06, chestX: 1.06, chestZ: 0.72, waistX: 1.04, hipsX: 0.94, jaw: 1.05 },
        palette: { top: 0xd9d6cc, topStripe: 0x9c2a24, trunks: 0x1b2740, boots: 0x1f1c1a, glove: 0x9aa3ab, mitt: 0x8c1d1d },
      },
      posture: { lean: 0.01, bounce: 0.015, sway: 0.26, drop: 0.01, hands: 0.14, stance: 1.04, headPitch: 0.01 },
    },
    // boxer-puncher with a champion's jab: still the hardest rung, but he wins it at range
    style: {
      weights: { rope_snap: 58, swing_bridge: 22, anchor_drop: 20 },
      feintWeights: { swing_bridge: 55, anchor_drop: 45 },
      comboWeights: { snap_drop: 60, bridge_snap: 35, double_bridge: 5 },
    },
  },
]);

export const TUG_INDEX = ROSTER.findIndex((o) => o.difficulty === TUG_DIFFICULTY);

/** Her difficulty exactly as the ladder places her: 0.8 → 80th percentile. */
export const TUG_PERCENTILE = (TUG_INDEX + 1) / ROSTER.length;

/**
 * Multipliers applied at match start. All four are 1 for Tugboat.
 * @param {number} difficulty 0..1
 * @returns {{hp:number, damage:number, windup:number, cooldown:number}}
 */
export function scaleFor(difficulty) {
  const k = (Math.max(0, Math.min(1, difficulty)) - TUG_DIFFICULTY) * SCALE_PER_POINT;
  return { hp: 1 + k, damage: 1 + k, windup: 1 - k, cooldown: 1 - k };
}

/** The roster entry for the current career, or null (no career → Tugboat at baseline). */
export function opponentAt(career) {
  if (!career?.active) return null;
  return ROSTER[Math.max(0, Math.min(ROSTER.length - 1, career.index | 0))];
}

function careerAt(index, champion) {
  const o = ROSTER[index];
  const next = ROSTER[index + 1] ?? null;
  return {
    active: true,
    index,
    total: ROSTER.length,
    champion,
    fullName: o.fullName,
    shortName: o.shortName,
    nextFull: next?.fullName ?? null,
    nextShort: next?.shortName ?? null,
  };
}

/** Build the career for an index from storage (clamped). */
export function careerFrom({ index = 0, champion = false } = {}) {
  const i = Math.max(0, Math.min(ROSTER.length - 1, index | 0));
  return careerAt(i, !!champion && i === ROSTER.length - 1);
}

/** A win moves one rung up; the last rung becomes the world champion (and stays there for title defences). */
export function advanceCareer(career) {
  if (!career?.active || career.champion) return false;
  const next = career.index + 1;
  const champion = next >= ROSTER.length;
  Object.assign(career, careerAt(champion ? ROSTER.length - 1 : next, champion));
  return true;
}
