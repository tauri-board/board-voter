<script lang="ts">
  const MIN_CAN = 2;
  const MAX_CAN = 26;
  const MIN_SEATS = 1;
  const MAX_SEATS = 5;

  const MIN_APPROVAL_RATE = 0.5;

  export let setup = {
    seats: 2,
    num_candidates: 5,
    num_voters: 5,
    num_again: 2,
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
  };

  function compute() {
    try {
      big_bad = null;
      let lut: Map<string, number> = new Map();
      candidates.forEach((c, i) => lut.set(c, i));

      // Number of votes received
      out.count = Array(setup.num_candidates).fill(0);
      for (const votes of setup.voted) {
        for (const vote of votes) {
          let i = lut.get(vote);
          if (i === undefined) throw `Vote for unknown candidate '${vote}'`;
          out.count[i]++;
        }
      }
      out.rate = out.count.map((c) => c / setup.num_voters);
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

  const onvote = (x: number) => (e) => {
    let chunks = parse_votes(e.target.value);
    setup.voted[x] = chunks;
    e.target.value = fmt_votes(chunks);
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
    setup.num_voters = between(3, Number(e.target.value), 7);
    e.target.value = setup.num_voters;
    update_votnames();
    save();
  }
  export function onagain(e) {
    setup.num_again = between(0, Number(e.target.value), setup.num_candidates);
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
        <td>{out.count[i]}</td>
        <td>{out.rate[i] >= MIN_APPROVAL_RATE ? "OK" : ""}</td>
      </tr>
    {/each}
  </table>
  <div>
    <h2>
      <input type="number" value={setup.num_voters} on:change={onvoters} step="1" min="3" max="7" />
      voters, with
      <input type="number" value={setup.num_again} on:change={onagain} step="1" min="0" max="7" />
      running again
    </h2>
    {#each voters as v, i}
      <p>
        <strong>{v}:</strong>
        <input type="text" on:change={onvote(i)} value={fmt_votes(setup.voted[i])} />
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
  }
</style>
