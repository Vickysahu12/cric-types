const { Sachin, Virat, Dhoni, Squad, Team } = require('./index.js');

// Describe the shape once
const Player = Squad({
  naam: Virat,           // must be a string
  runs: Sachin,           // must be a number
  outOfForm: Dhoni,       // must be a boolean
  centuries: Team(Sachin).optional(),
});

// Valid data
const rohit = Player.parse({
  naam: 'Rohit Sharma',
  runs: 264,
  outOfForm: false,
  centuries: [264, 209, 208],
});
console.log('Parsed:', rohit);

// Invalid data - throws with exact field path
try {
  Player.parse({ naam: 'Kohli', runs: 'pachaas', outOfForm: false });
} catch (err) {
  console.log('\nError caught:', err.message);
}

// safeParse - never throws
const result = Player.safeParse({ naam: 123, runs: 50, outOfForm: true });
if (!result.ok) {
  console.log('\nsafeParse result:', result.error);
}

// Nested: a whole match scorecard
const Match = Squad({
  venue: Virat,
  totalRuns: Sachin,
  playing11: Team(Virat),
});

const match = Match.parse({
  venue: 'Wankhede Stadium',
  totalRuns: 350,
  playing11: ['Rohit', 'Virat', 'Rahul', 'Surya', 'Hardik'],
});
console.log('\nMatch:', match);