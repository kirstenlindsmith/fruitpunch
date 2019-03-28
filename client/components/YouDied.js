import React from 'react'
import {Link} from 'react-router-dom'
import GameItem from './GameItem'

const YouDied = props => {
  const {
    level,
    score,
    time,
    togglepause,
    hoversound,
    buttonsound,
    whichbombuserhit,
    totalfruit,
    restartgame
  } = props

  return (
    <div>
      <div className="gameInfo">
        <img id="levelText" src="/assets/level.png" />
        <div id="level">: {level}</div>
        <img id="scoreText" src="/assets/score.png" />
        <div id="score">: {score}</div>
        <img id="timeText" src="/assets/timer.png" />
        <div id="time">: {time}</div>
        <img
          id="bombPauseButton"
          src="/assets/buttons/pauseButton.png"
          onClick={togglepause}
          onMouseEnter={() => hoversound.play()}
        />
      </div>
      <GameItem
        imageUrl={whichbombuserhit.explodeUrl}
        x={whichbombuserhit.x}
        y={whichbombuserhit.y}
        width={whichbombuserhit.width}
      />
      <div className="center">
        <img id="youDied" src="/assets/youDied.gif" />
        <div id="finalLevel">
          You got to level {level} <br />and squished {totalfruit} fruit!
        </div>
        <Link
          to={{
            pathname: '/leaderboard',
            state: {
              fromBombGame: true
            }
          }}
        >
          <button
            type="button"
            className="submitScoreFromGame"
            onMouseEnter={() => hoversound.play()}
            onClick={() => buttonsound.play()}
          >
            Submit Score
          </button>
        </Link>
        <div className="replayHomeButtons">
          <img
            id="replayButton"
            src="/assets/buttons/replayButton.png"
            className="button"
            onMouseEnter={() => hoversound.play()}
            onClick={() => {
              buttonsound.play()
              restartgame(score)
            }}
          />
          <Link to="/">
            <img
              id="homeButton"
              className="button"
              src="/assets/buttons/homeButton.png"
              onMouseEnter={() => hoversound.play()}
              onClick={() => buttonsound.play()}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default YouDied
