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
            <Link to="/select">
              <img
                id="startButton"
                className="button"
                src="/assets/startButton.png"
              />
            </Link>
            <br />
            <Link to="/about">
              <img
                id="aboutButton"
                className="button"
                src="/assets/aboutButton.png"
              />
            </Link>
          </div>
        </div>
        <div id="homeCenterOffset">
          <div id="instructions">
            <img id="instructionsTitle" src="/assets/instructions.png" />
            <div className="homePageText">
              <p>
                This app tracks your motions using your built-in webcam.<br />
                Click <b>START</b> once you are in front of an empty, well-lit
                backdrop, and have fun punching fruit. If you are in a busy
                space, try to make sure that you only have a max of two people
                in the frame!
              </p>
            </div>
          </div>
          <div id="privacy">
            <img id="privacyTitle" src="/assets/privacy.png" />
            <div className="homePageText">
              <p>
                Though this app requires webcam permissions to run, the video
                stream is local only! This means that the data from your camera
                is <b>NOT</b> being sent anywhere, is <b>NOT</b> being saved,
                and is <b>NOT</b> used for anything other than tracking your
                motions to destroy fruit. <br />What happens on your computer
                stays on your computer. <br />Enjoy the game!
              </p>
            </div>
          </div>
        </div>
      </center>
    </div>
  )
}

export default Home
