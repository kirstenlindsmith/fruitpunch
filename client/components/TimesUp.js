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
          src="/assets/pauseButton.png"
          onClick={togglepause}
          onMouseEnter={() => hoversound.play()}
        />
      </div>
      <div className="center">
        <img id="youWin" src="/assets/timesUp.gif" />
        <div id="finalTime">You got {totalfruit} fruit!</div>
        <Link to="/leaderboard">
          <button>Submit Score</button>
        </Link>
        <img
          id="replayButton"
          src="/assets/replayButton.png"
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
            src="/assets/homeButton.png"
            onClick={() => buttonsound.play()}
            onMouseEnter={() => hoverSound.play()}
          />
        </Link>
      </div>
    </div>
  )
}

export default TimesUp
