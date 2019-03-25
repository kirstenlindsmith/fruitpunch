'use strict'

const db = require('../server/db')
const Leaderboard = require('../server/db/leaderboard')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const leaderboard = await Promise.all([
    Leaderboard.create({name: 'SAM', score: 500}),
    Leaderboard.create({name: 'KRS', score: 550}),
    Leaderboard.create({name: 'CAS', score: 600}),
    Leaderboard.create({name: 'AAA', score: 300}),
    Leaderboard.create({name: 'BBB', score: 400}),
    Leaderboard.create({name: 'CCC', score: 500}),
    Leaderboard.create({name: 'DDD', score: 510}),
    Leaderboard.create({name: 'EEE', score: 10}),
    Leaderboard.create({name: 'FFF', score: 310}),
    Leaderboard.create({name: 'GGG', score: 350}),
    Leaderboard.create({name: 'HHH', score: 410})
  ])

  console.log(`seeded ${leaderboard.length} users`)
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
