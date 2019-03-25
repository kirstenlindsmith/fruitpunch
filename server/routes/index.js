const router = require('express').Router()
module.exports = router

router.use('/clockleaderboard', require('./clockleaderboard'))
router.use('/normalleaderboard', require('./normalleaderboard'))
router.use('/bombleaderboard', require('./bombleaderboard'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
