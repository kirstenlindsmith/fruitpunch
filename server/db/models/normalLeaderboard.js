const Sequelize = require('sequelize')
const db = require('../db')

const NormalLeaderboard = db.define('normalLeaderboard', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [3, 3]
    }
  },
  score: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

NormalLeaderboard.beforeCreate(playerScore => {
  playerScore.name = playerScore.name.toUpperCase()
})

module.exports = NormalLeaderboard
