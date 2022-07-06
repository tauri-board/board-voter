export const MIN_CANDIDATES = 2;
export const MAX_CANDIDATES = 26;
export const MIN_SEATS = 1;
export const MAX_SEATS = 5;

// Min voters is *practically* 2.
// Since the smallest board is 3 people. One may abstain entirely (simulated by entering no votes).
// But two abstains is an invalid result, since there would not be a simple majority to recognize the outcome.
export const MIN_VOTERS = 3;
export const MAX_VOTERS = 7;
