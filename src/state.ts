const CHAR_A = 65;
const CHAR_Z = 90;

export type Setup = {
  seats: number;
  num_candidates: number;
  num_voters: number;
  num_again: number;
  deduction: number[];
  voted: string[];

  deductionFor(i: number): number;
  votesBy(i: number): string[];
  generateCandidateNames(): string[];
  generateVoterNames(): string[];
  cleanup(): void;
};

export const DEFAULT_SETUP: Setup = {
  seats: 2,
  num_candidates: 5,
  num_voters: 5,
  num_again: 2,
  deduction: [-1, -1] as number[],
  voted: ["A", "B", "X", "X", "X"] as string[],

  deductionFor(i: number): number {
    return this.deduction[i] || 0;
  },

  votesBy(i: number): string[] {
    return (this.voted[i] || "").split("");
  },

  generateCandidateNames(): string[] {
    let candidates = [];
    for (let i = 0; i < this.num_candidates; i++) {
      let name =
        i < this.num_again
          ? String.fromCodePoint(CHAR_A + i)
          : String.fromCodePoint(CHAR_Z + 1 - this.num_candidates + i);
      candidates.push(name);
    }
    return candidates;
  },

  generateVoterNames(): string[] {
    let voters = [];
    for (let i = 0; i < this.num_voters; i++) {
      let name = String.fromCodePoint(CHAR_A + i);
      voters.push(name);
    }
    return voters;
  },

  cleanup() {
    this.voted.splice(this.num_voters);
    this.deduction.splice(this.num_again);
    for (const k in this) {
      if (!SETUP_KEYS.includes(k) && Object.prototype.hasOwnProperty.call(this, k)) {
        delete this[k];
      }
    }
  },
};

export const SETUP_KEYS = Object.keys(DEFAULT_SETUP);
