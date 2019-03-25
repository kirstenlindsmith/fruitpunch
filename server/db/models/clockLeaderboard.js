const Sequelize = require('sequelize')
const db = require('../db')

const ClockLeaderboard = db.define('clockLeaderboard', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [3, 3]
    }
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = ClockLeaderboard
