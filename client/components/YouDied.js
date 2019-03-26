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
          src="/assets/pauseButton.png"
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
        <img
          id="replayButton"
          src="/assets/replayButton.png"
          className="button"
          onMouseEnter={() => hoversound.play()}
          onClick={() => {
            buttonsound.play()
            restartgame()
          }}
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

export default YouDied
