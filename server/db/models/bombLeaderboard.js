const Sequelize = require('sequelize')
const db = require('../db')

const BombLeaderboard = db.define('bombLeaderboard', {
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

BombLeaderboard.beforeCreate(playerScore => {
  playerScore.name = playerScore.name.toUpperCase()
})

module.exports = BombLeaderboard
