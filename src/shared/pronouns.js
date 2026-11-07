// shared/pronouns.js — the opponent's pronouns, so every line of copy follows the persona (owner: PD).
// The personas carry a "he/him" | "she/her" | "they/them" tag (game/roster.js); copy uses {subj}/{obj}/{poss}
// placeholders and fillPronouns() resolves them. Missing persona = Tamsin, so stubs and old states read female.

// subjS = contraction, be = copula, vs = third-person -s ("" for they). Copy uses these so "they" reads right.
const SHE = Object.freeze({ subj: 'she', obj: 'her', poss: 'her', subjS: 'she’s', be: 'is', vs: 's' });
const HE = Object.freeze({ subj: 'he', obj: 'him', poss: 'his', subjS: 'he’s', be: 'is', vs: 's' });
const THEY = Object.freeze({ subj: 'they', obj: 'them', poss: 'their', subjS: 'they’re', be: 'are', vs: '' });

const up = (s) => s[0].toUpperCase() + s.slice(1);

/** @param {import('./types.js').GameState} [state] */
export function pronounsOf(state) {
  switch (state?.opponent?.persona?.pronouns) {
    case 'he/him': return HE;
    case 'they/them': return THEY;
    default: return SHE;
  }
}

/**
 * Resolve {subj}/{obj}/{poss} (and the capitalised {Subj}/{Obj}/{Poss}) in one line of copy.
 * @param {string} text
 * @param {{subj:string, obj:string, poss:string}} pr
 */
export function fillPronouns(text, pr = SHE) {
  if (!text) return '';
  return text
    .replace(/\{SubjS\}/g, up(pr.subjS))
    .replace(/\{subjS\}/g, pr.subjS)
    .replace(/\{Subj\}/g, up(pr.subj))
    .replace(/\{subj\}/g, pr.subj)
    .replace(/\{Obj\}/g, up(pr.obj))
    .replace(/\{obj\}/g, pr.obj)
    .replace(/\{Poss\}/g, up(pr.poss))
    .replace(/\{poss\}/g, pr.poss)
    .replace(/\{be\}/g, pr.be)
    .replace(/\{vs\}/g, pr.vs);
}
