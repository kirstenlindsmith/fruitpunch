import React from 'react'
import {Link} from 'react-router-dom'

const GameSelect = () => {
  const buttonSound = new Audio('/assets/buttonPress.mp3')
  const hoverSound = new Audio('/assets/buttonHover.mp3')
  return (
    <div className="center homePage">
      <iframe
        src="/assets/silence.mp3"
        allow="autoplay"
        style={{display: 'none'}}
        id="iframeAudio"
      />
      <audio loop="loop" autoPlay="autoplay">
        <source
          src="/assets/theWonderfulStarsWalkIsWonderful.mp3"
          type="audio/mpeg"
        />
      </audio>
      <center>
        <div>
          <div className="title">
            <img id="gameSelectTitle" src="/assets/selectAGame.png" />
          </div>
          <div id="gameSelectDiv">
            <Link to="/game1">
              <button
                type="button"
                className="gameSelectButton"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              >
                Normal Mode
              </button>
            </Link>
            <br />
            <Link to="/game2">
              <button
                type="button"
                id="beatTheClock"
                className="gameSelectButton"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              >
                Beat The Clock
              </button>
            </Link>
            <br />
            <Link to="/game3">
              <button
                type="button"
                id="suddenDeath"
                className="gameSelectButton"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              >
                Sudden Death
              </button>
            </Link>
            <a href="/">
              <img
                className="homeButton"
                id="selectBackButton"
                src="/assets/backButton.png"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              />
            </a>
          </div>
        </div>
      </center>
    </div>
  )
}

export default GameSelect
