const { Sachin, Virat, Dhoni, Squad, Team } = require('./index.js');

let passed = 0;
let failed = 0;

function check(desc, fn) {
  try {
    fn();
    passed++;
    console.log(`ok - ${desc}`);
  } catch (err) {
    failed++;
    console.log(`FAIL - ${desc}`);
    console.log(`   ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

// Primitives - valid
check('Sachin accepts a number', () => {
  assert(Sachin.parse(100) === 100);
});

check('Virat accepts a string', () => {
  assert(Virat.parse('Kohli') === 'Kohli');
});

check('Dhoni accepts a boolean', () => {
  assert(Dhoni.parse(true) === true);
});

// Primitives - invalid
check('Sachin rejects a string', () => {
  let threw = false;
  try {
    Sachin.parse('not a number');
  } catch (err) {
    threw = true;
  }
  assert(threw, 'expected throw');
});

check('Virat rejects a number', () => {
  let threw = false;
  try {
    Virat.parse(42);
  } catch (err) {
    threw = true;
  }
  assert(threw, 'expected throw');
});

// Squad (object)
const Player = Squad({
  naam: Virat,
  runs: Sachin,
  outOfForm: Dhoni,
});

check('Squad parses a valid object', () => {
  const p = Player.parse({ naam: 'Rohit', runs: 45, outOfForm: false });
  assert(p.naam === 'Rohit' && p.runs === 45 && p.outOfForm === false);
});

check('Squad throws with field path on bad data', () => {
  try {
    Player.parse({ naam: 'Rohit', runs: 'chaalis', outOfForm: false });
    throw new Error('should have thrown');
  } catch (err) {
    assert(err.message.includes('value.runs'), `expected path in message, got: ${err.message}`);
  }
});

// Team (array)
const Squad11 = Team(Virat);

check('Team parses an array of strings', () => {
  const names = Squad11.parse(['Rohit', 'Virat', 'Rahul']);
  assert(names.length === 3);
});

check('Team throws with index path on bad data', () => {
  try {
    Squad11.parse(['Rohit', 42, 'Rahul']);
    throw new Error('should have thrown');
  } catch (err) {
    assert(err.message.includes('value[1]'), `expected index path, got: ${err.message}`);
  }
});

// Optional
check('optional() allows undefined', () => {
  const maybeName = Virat.optional();
  assert(maybeName.parse(undefined) === undefined);
  assert(maybeName.parse('Dhoni') === 'Dhoni');
});

// safeParse
check('safeParse returns ok:true on valid data', () => {
  const result = Sachin.safeParse(50);
  assert(result.ok === true && result.value === 50);
});

check('safeParse returns ok:false on invalid data, never throws', () => {
  const result = Sachin.safeParse('fifty');
  assert(result.ok === false && typeof result.error === 'string');
});

// Nested object + array
const Match = Squad({
  venue: Virat,
  totalRuns: Sachin,
  playing11: Team(Virat),
});

check('nested Squad + Team validates deeply', () => {
  const m = Match.parse({
    venue: 'Wankhede',
    totalRuns: 350,
    playing11: ['Rohit', 'Virat', 'Rahul'],
  });
  assert(m.playing11.length === 3);
});

check('nested error reports deep path', () => {
  try {
    Match.parse({
      venue: 'Wankhede',
      totalRuns: 350,
      playing11: ['Rohit', 42],
    });
    throw new Error('should have thrown');
  } catch (err) {
    assert(err.message.includes('value.playing11[1]'), `expected deep path, got: ${err.message}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);