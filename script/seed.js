'use strict'

const db = require('../server/db')
const {
  NormalLeaderboard,
  ClockLeaderboard,
  BombLeaderboard
} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const normalLeaderboard = await Promise.all([
    NormalLeaderboard.create({name: 'SAM', score: '01:25'}),
    NormalLeaderboard.create({name: 'KRS', score: '01:45'}),
    NormalLeaderboard.create({name: 'CAS', score: '02:45'}),
    NormalLeaderboard.create({name: 'AAA', score: '01:55'}),
    NormalLeaderboard.create({name: 'BBB', score: '02:55'}),
    NormalLeaderboard.create({name: 'CCC', score: '02:35'}),
    NormalLeaderboard.create({name: 'DDD', score: '02:15'}),
    NormalLeaderboard.create({name: 'EEE', score: '01:50'}),
    NormalLeaderboard.create({name: 'FFF', score: '01:40'}),
    NormalLeaderboard.create({name: 'GGG', score: '01:00'}),
    NormalLeaderboard.create({name: 'HHH', score: '01:25'})
  ])

  const clockLeaderboard = await Promise.all([
    ClockLeaderboard.create({name: 'SAM', score: 500}),
    ClockLeaderboard.create({name: 'KRS', score: 550}),
    ClockLeaderboard.create({name: 'CAS', score: 600}),
    ClockLeaderboard.create({name: 'AAA', score: 300}),
    ClockLeaderboard.create({name: 'BBB', score: 400}),
    ClockLeaderboard.create({name: 'CCC', score: 500}),
    ClockLeaderboard.create({name: 'DDD', score: 510}),
    ClockLeaderboard.create({name: 'EEE', score: 10}),
    ClockLeaderboard.create({name: 'FFF', score: 310}),
    ClockLeaderboard.create({name: 'GGG', score: 350}),
    ClockLeaderboard.create({name: 'HHH', score: 410})
  ])

  const bombLeaderboard = await Promise.all([
    BombLeaderboard.create({name: 'SAM', score: 0}),
    BombLeaderboard.create({name: 'KRS', score: 10}),
    BombLeaderboard.create({name: 'CAS', score: 20}),
    BombLeaderboard.create({name: 'AAA', score: 30}),
    BombLeaderboard.create({name: 'BBB', score: 40}),
    BombLeaderboard.create({name: 'CCC', score: 50}),
    BombLeaderboard.create({name: 'DDD', score: 60}),
    BombLeaderboard.create({name: 'EEE', score: 70}),
    BombLeaderboard.create({name: 'FFF', score: 20}),
    BombLeaderboard.create({name: 'GGG', score: 30}),
    BombLeaderboard.create({name: 'HHH', score: 40})
  ])

  console.log(`seeded ${normalLeaderboard.length} normal game scores,
   ${clockLeaderboard.length} clock game scores, and
   ${bombLeaderboard.length} bomb game scores`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}
