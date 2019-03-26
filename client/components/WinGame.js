import React from 'react'
import {Link} from 'react-router-dom'

const WinGame = props => {
  const {
    score,
    time,
    togglepause,
    hoversound,
    buttonsound,
    finaltime,
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
        <img id="youWin" src="/assets/win.gif" />
        <div id="finalTime">Your time was: {finaltime}</div>
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
            onMouseEnter={() => hoversound.play()}
            onClick={() => buttonsound.play()}
          />
        </Link>
      </div>
    </div>
  )
}

export default WinGame
