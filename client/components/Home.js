import React from 'react'
import {Link} from 'react-router-dom'

const Home = () => {
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
            <img id="logo" src="/assets/FruitPunch.gif" />
          </div>
          <div id="homeButtons">
            <Link to="/game">
              <img id="startButton" src="/assets/startButton.png" />
            </Link>
            <br />
            <Link to="/about">
              <img id="aboutButton" src="/assets/aboutButton.png" />
            </Link>
          </div>
        </div>

        <div id="instructions">
          <img id="instructionsTitle" src="/assets/instructions.png" />
          <div id="instructionsText">
            <p>
              This app tracks your motions using your built-in webcam.<br />
              Click <b>START</b> once you are in front of an empty, well-lit
              backdrop.<br />
              If you are in a busy space, try to make sure that you only have a
              max of two people in the frame at once!
            </p>
          </div>
        </div>
      </center>
    </div>
  )
}

export default Home
