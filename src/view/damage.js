const clamp01 = (x) => Math.max(0, Math.min(1, x));

/** Presentation only: never distort tracking, controls or combat timing. */
export function damageAmount(state, lastHit = null) {
  if (state.phase !== 'fight' || state.player.down) return 0;
  const p = state.player;
  const missing = clamp01(1 - p.hp / p.maxHp);
  const age = lastHit ? state.time - lastHit.t : Infinity;
  const duration = 0.8 + missing * 1.4;
  const impact = age >= 0 && age < duration
    ? (0.25 + 0.15 * lastHit.tier + missing * 0.35) * (1 - age / duration) ** 2 : 0;
  const hurt = Number.isFinite(p.hurtUntil) && state.time < p.hurtUntil ? 0.65 : 0;
  return clamp01(Math.max(impact, hurt, Math.max(0, missing - 0.55) * 0.8));
}
