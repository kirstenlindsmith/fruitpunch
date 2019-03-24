import React from 'react'
import {Link} from 'react-router-dom'

const About = () => {
  const buttonSound = new Audio('/assets/buttonPress.mp3')
  const hoverSound = new Audio('/assets/buttonHover.mp3')
  return (
    <div className="center aboutPage">
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
          <img src="/assets/AboutUs.gif" />
          <div id="aboutText">
            <h1>
              This app was created by <br />SAM & CASSIE & KIRSTEN
            </h1>
            <p>We are really really cool.</p>
            <Link to="/">
              <img
                className="homeButton"
                id="homeButton"
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

export default About
