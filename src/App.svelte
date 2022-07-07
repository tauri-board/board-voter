<script lang="ts">
  import { MIN_SEATS, MAX_SEATS, MIN_VOTERS, MAX_VOTERS, MIN_CANDIDATES, MAX_CANDIDATES } from "./const";
  import type { RuleSet } from "./logic";
  import { tick } from "./logic";
  import { DEFAULT_SETUP, type Setup } from "./state";

  export let detailed = true;

  const rules: RuleSet = {
    // At least 50% of the voters should back a candidate, to be considered suitable.
    minApprovalRate: 0.5,

    // People running again MUST vote for themselves first, if this is set.
    mustVoteSelfFirst: true,
  };

  // Note: we depend on reassigning the setup variable to update the UI.
  export let setup: Setup = Object.assign({}, DEFAULT_SETUP);

  function save() {
    window.localStorage.setup = JSON.stringify(setup);
  }

  function load(json?: string) {
    try {
      setup = Object.assign(setup, JSON.parse(json || window.localStorage.setup));
      save();
    } catch (_) {}
  }

  load();

  // Note: we depend on reassigning the setup variable to update the UI.
  export let out = tick(rules, setup);

  function update() {
    out = tick(rules, setup);
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
    update();
  }

  function between(min: number, x: number, max: number): number {
    return Math.min(Math.max(min, x), max);
  }

  function parse_votes(text: string): string {
    return text
      .toUpperCase()
      .split(/[,; ]*/)
      .join("");
  }

  const onvote = (i: number) => (e) => {
    let chunks = parse_votes(e.target.value);
    setup.voted[i] = chunks;
    e.target.value = setup.votesBy(i).join(", ");
    save();
    update();
  };
  const onhandicap = (i: number) => (e) => {
    setup.handicap[i] = Number(e.target.value);
    save();
    update();
  };
  export function onseats(e) {
    setup.seats = between(MIN_SEATS, Number(e.target.value), MAX_SEATS);
    e.target.value = setup.seats;
    save();
    update();
  }
  export function oncandidates(e) {
    setup.num_candidates = between(MIN_CANDIDATES, Number(e.target.value), MAX_CANDIDATES);
    e.target.value = setup.num_candidates;
    save();
    update();
  }
  export function onvoters(e) {
    setup.num_voters = between(MIN_VOTERS, Number(e.target.value), MAX_VOTERS);
    e.target.value = setup.num_voters;
    save();
    update();
  }
  export function onagain(e) {
    let max = Math.min(setup.num_candidates, setup.num_voters);
    setup.num_again = between(0, Number(e.target.value), max);
    e.target.value = setup.num_again;
    save();
    update();
  }
</script>

<main class={detailed ? "detailed" : ""}>
  {#if out.error}
    <div class="big_bad">{out.error}</div>
  {/if}
  <p>
    <label>
      <input type="checkbox" checked={detailed} on:change={(_) => (detailed = !detailed)} />
      Detailed
    </label>
  </p>
  <h2>
    <input
      type="number"
      value={setup.num_candidates}
      on:change={oncandidates}
      step="1"
      min={MIN_CANDIDATES}
      max={MAX_CANDIDATES}
    />
    candidates, for
    <input type="number" value={setup.seats} on:change={onseats} step="1" min={MIN_SEATS} max={MAX_SEATS} />
    seats
  </h2>
  <table>
    <thead>
      <tr>
        <th />
        <th>
          Confidence<br />
          <small>min. {(rules.minApprovalRate * 100).toFixed(0)}%</small>
        </th>
        {#each out.round_selection as sel, round}
          <th
            title={`Vote cursor: ${out.round_selection[round]}\n` + `Counted as: ${out.round_count[round].join("|")}`}
          >
            Round {round + 1}<br />
            <small>incl. handicap</small>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each out.candidateNames as name, cid}
        <tr>
          <th>{name}</th>
          <td>{out.count[cid]}<small>/{setup.num_voters}</small> {out.approved[cid] ? "✔" : ""}</td>
          {#each out.round_wins as win, round}
            <td
              title={`Vote cursor: ${out.round_selection[round]}\n` + `Counted as: ${out.round_count[round].join("|")}`}
            >
              <small>{out.round_count[round][cid]}</small>
              {win == cid ? "#" + (round + 1) : ""}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <div>
    <h2>
      <input type="number" value={setup.num_voters} on:change={onvoters} step="1" min={MIN_VOTERS} max={MAX_VOTERS} />
      voters, with
      <input type="number" value={setup.num_again} on:change={onagain} step="1" min="0" max={MAX_VOTERS} />
      running again
    </h2>
    <table>
      <thead>
        <tr>
          <th />
          <th>Votes <small>in order of preference</small></th>
          <th>Handicaps <small>for consecutive terms</small></th>
          {#each out.round_selection as sel, round}
            <th><small>Cursor {round + 1}</small></th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each out.voterNames as name, vid}
          <tr>
            <th>{name}:</th>
            <td><input type="text" on:change={onvote(vid)} value={setup.votesBy(vid).join(", ")} /></td>
            <td>
              {#if vid < setup.num_again}
                <input
                  type="number"
                  on:change={onhandicap(vid)}
                  value={setup.handicapFor(vid)}
                  step={0.5}
                  min={-10}
                  max={-0.5}
                />
              {/if}
            </td>
            {#each out.round_selection as sel, round}
              <td><small>{sel[vid]}</small></td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
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

  td,
  th {
    padding: 0.1em 0.7em;
  }

  small {
    color: #999;
    display: none;
  }

  .detailed small {
    display: inline;
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

  input[type="number"] {
    max-width: 90px;
  }
</style>
