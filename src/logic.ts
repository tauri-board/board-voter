import type { Setup } from "./state";

export type RuleSet = {
  minApprovalRate: number;
  mustVoteSelfFirst: boolean;
};

export type Result = {
  error: string | null;
  candidateNames: string[];
  voterNames: string[];
  approved: boolean[];
  count: number[];
  rate: number[];
  round_selection: string[];
  round_count: number[][];
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

function to_count(lut: Map<string, number>, handicap: number[], votes: string): number[] {
  let count = Array(lut.size)
    .fill(0)
    .map((val, cid) => handicap[cid] || val);

  for (const vote of votes) {
    let i = lut.get(vote);
    if (i === undefined) throw `Vote for unknown candidate '${vote}'`;
    count[i]++;
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
    round_count: [],
    round_wins: [],
  };

  let lut: Map<string, number> = new Map();
  let have_won: Set<string> = new Set();
  let are_approved: Set<string> = new Set();

  function find_selection(setup: Setup, have_won: Set<string>, are_approved: Set<string>): string {
    return Array(setup.num_voters)
      .fill(0)
      // For every voter, find the *first* vote in their list that:
      // 1. Is approved
      // 2. Has not already won
      .map((_, vid) => setup.votesBy(vid).find((vote) => are_approved.has(vote) && !have_won.has(vote)))
      .join("");
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
    // Note: handicap is not applied to approval rate.
    result.count = to_count(lut, [], setup.voted.join(""));

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
      // update_cursor();
      // Map the cursor, which is an array of offsets, to a string of names.
      // E.g. [0,4,1,0,0] to "AXBAC".
      // let selection = cursor.map((pos, vid) => setup.votesBy(vid)[pos]).join("");
      if (selection == "") {
        throw `No more suitable candidates than ${r}`;
      }
      let count = to_count(lut, setup.handicap, selection);
      let win = find_max(count);
      have_won.add(result.candidateNames[win]);
      result.round_selection.push(selection);
      result.round_count.push(count);
      result.round_wins.push(win);
    }
  } catch (e) {
    result.error = e.toString();
  }

  return result;
}
