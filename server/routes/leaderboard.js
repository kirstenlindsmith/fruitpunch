const router = require('express').Router()
const Leaderboard = require('../db/leaderboard')
module.exports = router

router.get('/topten', async (req, res, next) => {
  try {
    const topTen = await Leaderboard.findAll({
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
    const newScore = await Leaderboard.create(req.body)
    res.json(newScore)
  } catch (err) {
    next(err)
  }
})
