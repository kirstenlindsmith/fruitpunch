import React from 'react'
import {Link} from 'react-router-dom'
import {Link as ScrollLink} from 'react-scroll'

const Home = () => {
  const buttonSound = new Audio('/assets/audio/buttonPress.mp3')
  const hoverSound = new Audio('/assets/audio/buttonHover.mp3')
  return (
    <div className="center homePage">
      <iframe
        src="/assets/audio/silence.mp3"
        allow="autoplay"
        style={{display: 'none'}}
        id="iframeAudio"
      />
      <audio loop="loop" autoPlay="autoplay">
        <source
          src="/assets/audio/theWonderfulStarsWalkIsWonderful.mp3"
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
                src="/assets/buttons/startButton.png"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              />
            </Link>
            <br />
            <Link to="/leaderboard">
              <img
                id="leaderboardButton"
                className="button"
                src="/assets/leaderboardButton.png"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              />
            </Link>
            <br />
            <Link to="/about">
              <img
                id="aboutButton"
                className="button"
                src="/assets/buttons/aboutButton.png"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              />
            </Link>
            <br />
            <ScrollLink
              className="scrollButton"
              to="instructions"
              spy={true}
              smooth={true}
              duration={500}
            >
              <button id="homeToBottomButton" className="scrollButton">
                ⬇
              </button>
            </ScrollLink>
          </div>
        </div>
        <div id="homeCenterOffset">
          <div id="instructions">
            <img id="instructionsTitle" src="/assets/instructions.png" />
            <div className="homePageText">
              <p>
                This app tracks your motions using your built-in webcam.<br />
                Click <b>START</b> once you are in front of an empty, well-lit
                backdrop. If you are in a visually-busy space, try to make sure
                that you only have a max of two people in the frame. Have fun
                punching fruit! (See the{' '}
                <b>
                  <a href="/about">ABOUT</a>
                </b>{' '}
                page for more details.)
              </p>
            </div>
          </div>
          <div id="punchMan">
            <img id="instructionsGif" src="/assets/punch.gif" />
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
          <div id="punchMan2">
            <img id="privacyGif" src="/assets/punch2.gif" />
          </div>
        </div>
        <ScrollLink
          className="scrollButton"
          to="logo"
          spy={true}
          smooth={true}
          duration={500}
        >
          <button id="homeToTopButton" className="scrollButton">
            ⬆
          </button>
        </ScrollLink>
      </center>
    </div>
  )
}

export default Home
