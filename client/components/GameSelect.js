import React from 'react'
import {Link} from 'react-router-dom'

const GameSelect = () => {
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
              <button type="button" className="gameSelectButton">
                Normal Mode
              </button>
            </Link>
            <br />
            <Link to="/game2">
              <button
                type="button"
                id="beatTheClock"
                className="gameSelectButton"
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
              >
                Sudden Death
              </button>
            </Link>
            <a href="/">
              <img className="homeButton" src="/assets/backButton.png" />
            </a>
          </div>
        </div>
      </center>
    </div>
  )
}

export default GameSelect
