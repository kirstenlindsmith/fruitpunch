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
            <a href="game1">
              <button
                type="button"
                className="gameSelectButton"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              >
                Normal Mode
              </button>
            </a>
            <br />
            <a href="/game2">
              <button
                type="button"
                id="beatTheClock"
                className="gameSelectButton"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              >
                Beat The Clock
              </button>
            </a>
            <br />
            <a href="/game3">
              <button
                type="button"
                id="suddenDeath"
                className="gameSelectButton"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              >
                Sudden Death
              </button>
            </a>
            <Link to="/">
              <img
                className="homeButton"
                id="selectBackButton"
                src="/assets/backButton.png"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              />
            </Link>
          </div>
        </div>
      </center>
    </div>
  )
}

export default GameSelect
