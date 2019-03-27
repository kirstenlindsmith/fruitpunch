import React from 'react'
import {Link} from 'react-router-dom'

const TimesUp = props => {
  const {
    score,
    time,
    togglepause,
    hoversound,
    buttonsound,
    totalfruit,
    restartgame
  } = props

  return (
    <div>
      <div className="gameInfo">
        <img id="scoreText" src="/assets/score.png" />
        <div id="score">: {score}</div>
        <img id="timeText" src="/assets/timer.png" />
        <div id="time">: {time}</div>
        <img
          id="pauseButton"
          src="/assets/buttons/pauseButton.png"
          onClick={togglepause}
          onMouseEnter={() => hoversound.play()}
        />
      </div>
      <div className="center">
        <img id="youWin" src="/assets/timesUp.gif" />
        <div id="finalTime">You got {totalfruit} fruit!</div>
        <Link
          to={{
            pathname: '/leaderboard',
            state: {
              fromClockGame: true
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
            onClick={() => {
              buttonsound.play()
              restartgame()
            }}
            onMouseEnter={() => hoversound.play()}
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

export default TimesUp
