const router = require('express').Router()
module.exports = router

router.use('/clockGame', require('./clockLeaderboard'))
router.use('/normalGame', require('./normalLeaderboard'))
router.use('/bombGame', require('./bombLeaderboard'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
