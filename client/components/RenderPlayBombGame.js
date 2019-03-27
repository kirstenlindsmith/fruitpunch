import React from 'react'
import GameItem from './GameItem'
import {pauseMenuDiv} from '../utils'

const RenderPlayBombGame = props => {
  const {
    level,
    score,
    time,
    togglepause,
    hoversound,
    buttonsound,
    pausestatus,
    item1,
    item2
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
      <div className="center">
        {pauseMenuDiv(pausestatus, togglepause, hoversound, buttonsound)}
      </div>
      <div>
        <GameItem
          key={item1.id}
          imageUrl={item1.imageUrl}
          x={item1.x}
          y={item1.y}
          width={item1.width}
        />

        <GameItem
          key={item2.id}
          imageUrl={item2.imageUrl}
          x={item2.x}
          y={item2.y}
          width={item2.width}
        />
      </div>
    </div>
  )
}

export default RenderPlayBombGame
