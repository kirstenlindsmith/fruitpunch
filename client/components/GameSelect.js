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
            <h1>SELECT A GAME:</h1>
            {/* <img id="logo" src="/assets/FruitPunch.gif" /> */}
          </div>
          <div id="gameSelectDiv">
            <Link to="/game1">
              <button type="button" className="gameSelectButton">
                Normal Mode
              </button>
            </Link>
            <br />
            <Link to="/game2">
              <button type="button" className="gameSelectButton">
                Beat The Clock
              </button>
            </Link>
            <a href="/">
              <img id="homeButton" src="/assets/homeButton.png" />
            </a>
          </div>
        </div>
      </center>
    </div>
  )
}

export default GameSelect
