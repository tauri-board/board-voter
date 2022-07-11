import { BLEND_RATIO } from "./const";
import type { Setup } from "./state";

export type RuleSet = {
  minApprovalRate: number;
  mustVoteSelfFirst: boolean;
  voteBlendRatio: number;
};

export type Count = number[];
export type Selection = (string | undefined)[];

export type Result = {
  error: string | null;
  candidateNames: string[];
  voterNames: string[];
  approved: boolean[];
  count: Count;
  rate: number[];
  round_selection: Selection[];
  round_selection_secondairy: Selection[];
  round_count: Count[];
  round_wins: number[];
};

function* votesIter(setup: Setup): Generator<[number, string[]]> {
  for (let vid = 0; vid < setup.num_voters; vid++) {
    yield [vid, setup.votesBy(vid)];
  }
}

function duplicates<T>(list: T[]): Set<T> {
  const seen = new Set<T>();
  const dup = new Set<T>();
  list.forEach((x: T) => {
    if (seen.has(x)) {
      dup.add(x);
    } else {
      seen.add(x);
    }
  });
  return dup;
}

function find_max(count: number[]): number {
  let max_i = 0;
  let max_val = count[0];

  for (let i = 1; i < count.length; i++) {
    if (count[i] > max_val) {
      max_i = i;
      max_val = count[i];
    }
  }

  return max_i;
}

function apply_deduction(raw_count: Count, deduction: Count): Count {
  return raw_count.map((count, cid) => count + (deduction[cid] || 0));
}

function blend_counts(pri_count: Count, sec_count: Count, pri_weight: number): Count {
  if (pri_weight > 1) throw "Can't have >100% weight for primary vote";
  if (pri_weight < 0) throw "Can't have <0% weight for primary vote";
  if (pri_weight == 1) return pri_count;
  if (pri_weight == 0) return sec_count;

  const sec_weight: number = 1.0 - pri_weight;
  return pri_count.map((count, cid) => count * pri_weight + sec_count[cid] * sec_weight);
}

function count_from_votes(lut: Map<string, number>, votes: Selection): Count {
  const count = Array(lut.size).fill(0);

  for (const vote of votes) {
    if (vote === undefined) continue;
    const cid = lut.get(vote);
    if (cid === undefined) throw `Vote for unknown candidate '${vote}'`;
    count[cid]++;
  }

  return count;
}

export function tick(rules: RuleSet, setup: Setup): Result {
  const result: Result = {
    error: null,
    candidateNames: [],
    voterNames: [],
    approved: [],
    count: [],
    rate: [],
    round_selection: [],
    round_selection_secondairy: [],
    round_count: [],
    round_wins: [],
  };

  let lut: Map<string, number> = new Map();
  let have_won: Set<string> = new Set();
  let are_approved: Set<string> = new Set();

  function find_selection(setup: Setup, have_won: Set<string>, are_approved: Set<string>): Selection {
    return (
      Array(setup.num_voters)
        .fill(0)
        // For every voter, find the *first* vote in their list that:
        // 1. Is approved
        // 2. Has not already won
        .map((_, vid) => setup.votesBy(vid).find((vote) => are_approved.has(vote) && !have_won.has(vote)))
    );
  }

  function find_selection_secondairy(
    setup: Setup,
    have_won: Set<string>,
    are_approved: Set<string>,
    primary: Selection
  ): Selection {
    return (
      Array(setup.num_voters)
        .fill(0)
        // For every voter, find the *first* vote in their list that:
        // 1. Is approved
        // 2. Has not already won
        // 3. Is not their primary vote
        .map((_, vid) =>
          setup.votesBy(vid).find((vote) => are_approved.has(vote) && !have_won.has(vote) && vote !== primary[vid])
        )
    );
  }

  try {
    result.candidateNames = setup.generateCandidateNames();
    result.voterNames = setup.generateVoterNames();

    // Validate each ordered set of votes.
    for (const [vid, votes] of votesIter(setup)) {
      let vname = result.voterNames[vid];

      // Check for duplicate votes.
      let dup = Array.from(duplicates(votes));
      if (dup.length > 0) {
        throw `Voter ${vname} has duplicate votes for ${dup}`;
      }

      // Enforce mustVoteSelfFirst rule.
      if (rules.mustVoteSelfFirst) {
        if (vid < setup.num_again && votes[0] != vname) {
          throw `Candidate ${vname} is running again, but MUST vote for self first`;
        }
      }
    }

    // Fill the LUT.
    result.candidateNames.forEach((cname, cid) => lut.set(cname, cid));

    // Sanity check an assumption we rely on, LUT.size == result.num_candidates == result.candidateNames.length;
    if (lut.size !== setup.num_candidates || lut.size !== result.candidateNames.length) {
      throw `LUT.size (${lut.size}) must match num_candidates (${setup.num_candidates}) and candidateNames.length (${result.candidateNames.length})`;
    }

    // Number of total votes each candidate received
    // Note: deduction is not applied to approval rate.
    result.count = count_from_votes(lut, setup.voted.map((s) => s.split("")).flat());

    // Translate that count...
    result.count.forEach((count, cid) => {
      // Into approval rates.
      const rate = (result.rate[cid] = count / setup.num_voters);
      // Into approval booleans.
      const approve = (result.approved[cid] = rate >= rules.minApprovalRate);

      // And keep a Set of candidates not approved.
      if (approve) {
        are_approved.add(result.candidateNames[cid]);
      }
    });

    // Run selection rounds.
    for (let r = 0; r < setup.seats; r++) {
      let selection = find_selection(setup, have_won, are_approved);
      let selection_secondairy = find_selection_secondairy(setup, have_won, are_approved, selection);
      // update_cursor();
      // Map the cursor, which is an array of offsets, to a string of names.
      // E.g. [0,4,1,0,0] to "AXBAC".
      // let selection = cursor.map((pos, vid) => setup.votesBy(vid)[pos]).join("");
      if (selection.every((v) => v === undefined)) {
        throw `No more suitable candidates than ${r}`;
      }
      const pri_count = count_from_votes(lut, selection);
      const sec_count = count_from_votes(lut, selection_secondairy);
      const blend_count = blend_counts(pri_count, sec_count, rules.voteBlendRatio);
      const count = apply_deduction(blend_count, setup.deduction);

      const win = find_max(count);
      have_won.add(result.candidateNames[win]);
      result.round_selection.push(selection);
      result.round_selection_secondairy.push(selection_secondairy);
      result.round_count.push(count);
      result.round_wins.push(win);
    }
  } catch (e) {
    result.error = e.toString();
  }

  return result;
}
