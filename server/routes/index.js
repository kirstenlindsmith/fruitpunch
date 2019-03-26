const router = require('express').Router()
module.exports = router

router.use('/clockGame', require('./clockleaderboard'))
router.use('/normalGame', require('./normalleaderboard'))
router.use('/bombGame', require('./bombleaderboard'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
