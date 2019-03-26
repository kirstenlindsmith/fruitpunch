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

ClockLeaderboard.beforeCreate(playerScore => {
  playerScore.name = playerScore.name.toUpperCase()
})

module.exports = ClockLeaderboard
