const router = require('express').Router()
const {BombLeaderboard} = require('../db/models')
module.exports = router

router.get('/topten', async (req, res, next) => {
  try {
    const topTen = await BombLeaderboard.findAll({
      order: [['score', 'DESC']],
      limit: 10
    })
    res.json(topTen)
  } catch (err) {
    next(err)
  }
})

router.post('/addtoboard', async (req, res, next) => {
  try {
    const newScore = await BombLeaderboard.create({
      name: req.body.name,
      score: req.body.score
    })
    res.json(newScore)
  } catch (err) {
    next(err)
  }
})
