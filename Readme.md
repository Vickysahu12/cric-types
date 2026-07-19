# cric-types 🏏

Runtime type-checking for JavaScript — with cricket names.

`Sachin` means number. `Virat` means string. `Dhoni` means boolean.
You use these to say what your data should look like, and `cric-types` makes sure it really does.

## The problem, in 4 lines

Plain JavaScript never checks anything:

```js
const player = { runs: "sau" };       // runs arrived as text, not a number
const nextRuns = player.runs + 50;    // "sau50"  ← wrong, but no error
```

You find out much later, somewhere else in your code. `cric-types` stops this at the front door.

## The fix

Describe the shape once:

```js
const Player = Squad({
  naam: Virat,   // must be a string
  runs: Sachin,  // must be a number
});
```

Then check real data against it:

```js
const player = Player.parse(await res.json());
// value.runs: 'Sachin' (number) chahiye tha, par mila 'string'.
```

The error names the exact field that's wrong — even deep inside arrays, like `value.playing11[1]`.

## Install

```bash
npm install cric-types
```

Zero dependencies. Works in plain Node with `require` — no config, no compiler.

## The types

| Validator      | Checks for               |
|----------------|---------------------------|
| `Sachin`       | number                    |
| `Virat`        | string                    |
| `Dhoni`        | boolean                   |
| `Squad(shape)` | object with a fixed shape |
| `Team(inner)`  | array of `inner`          |

## Usage

```js
const { Sachin, Virat, Dhoni, Squad, Team } = require('cric-types');

const Player = Squad({
  naam: Virat,               // string
  runs: Sachin,               // number
  outOfForm: Dhoni,           // boolean
  centuries: Team(Sachin),    // array of numbers
});

// .parse() returns the value, or throws on bad data
const rohit = Player.parse({
  naam: 'Rohit Sharma',
  runs: 264,
  outOfForm: false,
  centuries: [264, 209, 208],
});

// .safeParse() never throws — returns a result object
const result = Player.safeParse({ naam: 123, runs: 50, outOfForm: true });
if (!result.ok) {
  console.log(result.error);
  // value.naam: 'Virat' (string) chahiye tha, par mila 'number'.
}
```

## API

Every validator has three methods:

- **`.parse(value)`** — returns `value` if valid, otherwise throws a `CricError`.
- **`.safeParse(value)`** — returns `{ ok: true, value }` or `{ ok: false, error }`. Never throws.
- **`.optional()`** — returns a new validator that also accepts `undefined` (for optional fields).

Errors include the exact path to the bad field, e.g. `value.playing11[1]`, so you always know what to fix.

## Extending it

The whole library is one small `index.js`. Adding a new type is a few lines — copy an existing
primitive and change the `typeof` check. Ideas: `Sourav` for dates, an `either(A, B)` union that
accepts either of two validators, or a `.min(n)` refinement on `Sachin`.

## Run the tests

```bash
npm test        # runs test.js — 14 checks, no dependencies
npm run example # runs example.js
```

MIT licensed.