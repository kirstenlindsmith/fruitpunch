import React from 'react'

const About = () => {
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
            <a href="/">
              <img id="aboutHomeButton" src="/assets/homeButton.png" />
            </a>
          </div>
        </div>
      </center>
    </div>
  )
}

export default About
