<script lang="ts">
  const MIN_CAN = 2;
  const MAX_CAN = 26;
  const MIN_SEATS = 1;
  const MAX_SEATS = 5;

  // Min voters is *practically* 2.
  // Since the smallest board is 3 people. One may abstain entirely (simulated by entering no votes).
  // But two abstains is an invalid result, since there would not be a simple majority to recognize the outcome.
  const MIN_VOTERS = 3;
  const MAX_VOTERS = 7;

  const MIN_APPROVAL_RATE = 0.5;

  export let setup = {
    seats: 2,
    num_candidates: 5,
    num_voters: 5,
    num_again: 2,
    handicap: [] as number[],
    voted: [] as string[],
  };

  function save() {
    window.localStorage.setup = JSON.stringify(setup);
    compute();
  }

  function load(what?: string) {
    try {
      setup = {
        ...setup,
        ...JSON.parse(what || window.localStorage.setup),
      };
      update_cannames();
      update_votnames();
      save();
    } catch (_) {}
  }

  load();

  export let big_bad: string | null = null;
  export let candidates: string[] = [];
  export let voters: string[] = [];

  export let out = {
    count: [] as number[],
    rate: [] as number[],
    round_selection: [] as string[],
    round_count: [] as number[][],
    round_wins: [] as number[],
  };

  function to_count(lut: Map<string, number>, handicap: number[], votes: string): number[] {
    let count = Array(setup.num_candidates).fill(0);
    handicap.forEach((v, i) => {
      count[i] = v;
    });
    Array(setup.num_candidates).fill(0);
    for (const vote of votes) {
      let i = lut.get(vote);
      if (i === undefined) throw `Vote for unknown candidate '${vote}'`;
      count[i]++;
    }
    return count;
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

  function compute() {
    try {
      big_bad = null;
      let lut: Map<string, number> = new Map();
      let cursor = Array(setup.num_voters).fill(0);
      let win_set: Set<string> = new Set();
      let not_approved: Set<string> = new Set();
      out.round_selection = [];
      out.round_count = [];
      out.round_wins = [];

      // Fill the lut.
      candidates.forEach((c, i) => lut.set(c, i));

      // Number of total votes each candidate received
      // Note: handicap is not applied to approval rate.
      out.count = to_count(lut, [], setup.voted.join(""));

      // Translate that to an approval rate.
      out.rate = out.count.map((c) => c / setup.num_voters);
      out.rate.forEach((rate, i) => {
        if (rate < MIN_APPROVAL_RATE) {
          not_approved.add(candidates[i]);
        }
      });

      function update_cursor() {
        for (let i = 0; i < setup.num_voters; i++) {
          let x = 0;
          while (win_set.has(setup.voted[i][x]) || not_approved.has(setup.voted[i][x])) {
            x++;
          }
          cursor[i] = x;
        }
      }

      for (let r = 0; r < setup.seats; r++) {
        update_cursor();
        let selection = cursor.map((pi, vi) => setup.voted[vi][pi]).join("");
        if (selection == "") {
          throw `No more suitable candidates than ${r}`;
        }
        let count = to_count(lut, setup.handicap, selection);
        let win = find_max(count);
        win_set.add(candidates[win]);
        out.round_selection.push(selection);
        out.round_count.push(count);
        out.round_wins.push(win);
        console.log(r, selection, win);
      }
    } catch (e) {
      big_bad = e.toString();
    }
  }

  function select_all(e) {
    e.preventDefault();
    setTimeout(() => {
      e.target.setSelectionRange(0, e.target.value.length);
    }, 1);
  }

  function onsetup(e) {
    load(e.target.value);
    e.target.value = JSON.stringify(setup, null, 2);
  }

  function between(min: number, x: number, max: number): number {
    return Math.min(Math.max(min, x), max);
  }

  function votname(i: number): string {
    return String.fromCodePoint(65 + i);
  }

  function canname(i: number): string {
    return i < setup.num_again ? String.fromCodePoint(65 + i) : String.fromCodePoint(91 - setup.num_candidates + i);
  }

  const onvote = (i: number) => (e) => {
    let chunks = parse_votes(e.target.value);
    setup.voted[i] = chunks;
    e.target.value = fmt_votes(chunks);
    save();
  };

  const onhandicap = (i: number) => (e) => {
    setup.handicap[i] = Number(e.target.value);
    save();
  };

  function parse_votes(text: string): string {
    return text
      .toUpperCase()
      .split(/[,; ]*/)
      .join("");
  }

  function fmt_votes(votes: string | undefined): string {
    return !votes ? "" : votes.split("").join(", ");
  }

  function update_cannames() {
    candidates = [];
    for (let i = 0; i < setup.num_candidates; i++) {
      candidates.push(canname(i));
    }
  }

  function update_votnames() {
    voters = [];
    for (let i = 0; i < setup.num_voters; i++) {
      voters.push(votname(i));
    }
  }

  export function onseats(e) {
    setup.seats = between(MIN_SEATS, Number(e.target.value), MAX_SEATS);
    e.target.value = setup.seats;
    save();
  }
  export function oncandidates(e) {
    setup.num_candidates = between(MIN_CAN, Number(e.target.value), MAX_CAN);
    e.target.value = setup.num_candidates;
    update_cannames();
    save();
  }
  export function onvoters(e) {
    setup.num_voters = between(MIN_VOTERS, Number(e.target.value), MAX_VOTERS);
    e.target.value = setup.num_voters;
    update_votnames();
    save();
  }
  export function onagain(e) {
    let max = Math.min(setup.num_candidates, setup.num_voters);
    setup.num_again = between(0, Number(e.target.value), max);
    e.target.value = setup.num_again;
    update_cannames();
    save();
  }

  update_cannames();
  update_votnames();
  compute();
</script>

<main>
  {#if big_bad}
    <div class="big_bad">{big_bad}</div>
  {/if}
  <h2>
    <input type="number" value={setup.num_candidates} on:change={oncandidates} step="1" min={MIN_CAN} max={MAX_CAN} />
    candidates, for
    <input type="number" value={setup.seats} on:change={onseats} step="1" min={MIN_SEATS} max={MAX_SEATS} />
    seats
  </h2>
  <table>
    {#each candidates as c, i}
      <tr>
        <th>{c}</th>
        <td>{out.count[i]} {out.rate[i] >= MIN_APPROVAL_RATE ? "✔" : ""}</td>
        {#each out.round_wins as win, round}
          <td title={`Vote cursor: ${out.round_selection[round]}\n` + `Counted as: ${out.round_count[round].join("|")}`}
            >{win == i ? "#" + (round + 1) : ""}</td
          >
        {/each}
      </tr>
    {/each}
  </table>
  <div>
    <h2>
      <input type="number" value={setup.num_voters} on:change={onvoters} step="1" min={MIN_VOTERS} max={MAX_VOTERS} />
      voters, with
      <input type="number" value={setup.num_again} on:change={onagain} step="1" min="0" max={MAX_VOTERS} />
      running again
    </h2>
    {#each voters as v, i}
      <p>
        <strong>{v}:</strong>
        <input type="text" on:change={onvote(i)} value={fmt_votes(setup.voted[i])} />
        {#if i < setup.num_again}
          <input type="number" on:change={onhandicap(i)} value={-0.5} step={0.5} min={-10} max={-0.5} />
        {/if}
      </p>
    {/each}
  </div>
  <textarea class="share" on:focus={select_all} on:change={onsetup}>{JSON.stringify(setup, null, 2)}</textarea>
</main>

<style>
  main {
    text-align: left;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2em;
    font-weight: 300;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .big_bad {
    background-color: #faa;
  }

  .share {
    font-family: monospace;
    position: fixed;
    bottom: 1em;
    right: 1em;
    width: 260px;
    height: 300px;
    resize: none;
    background-color: #eee;
    color: #040;
  }
</style>
