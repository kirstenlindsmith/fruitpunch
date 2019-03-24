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
        <div id="aboutTheGame">
          <img src="/assets/aboutTheGame.gif" />
          <div className="aboutText">
            <p>
              This awesomely fun game was made created with PoseNet via
              TensorFlowjs, and rendered with React.
              <br />
              <br />
              <br />
              Music credits:
              <ul>
                <li>
                  <i>The Wonderful Star's Walk is Wonderful</i>, from Katamary
                  Damacy
                </li>
                <li>
                  <i>Crystal Ice Area</i>, from Kirby & The Amazing Mirror
                </li>
              </ul>
            </p>
          </div>
        </div>
        <div id="aboutUs">
          <img src="/assets/AboutUs.gif" />
          <div className="aboutText">
            <p>
              <a href="https://github.com/smashley729">Sam</a> likes piña
              cooladas. Lorem ipsem some other stuff.
              <br />
              <br />
              <br />
              <br />
              <a href="https://github.com/cerosner">Cassie</a> likes getting
              caught in the rain. This is a great bio.
              <br />
              <br />
              <br />
              <br />
              <a href="https://github.com/kirstenlindsmith">Kirsten</a> likes
              css. And has run out of good lyrics to use.
              <br />
              <br />
              <br />
              <br />
            </p>
          </div>
          <div id="sam">
            <img className="sprite" src="/assets/sam.png" />
          </div>
          <div id="cassie">
            <img className="sprite" src="/assets/cassie.png" />
          </div>
          <div id="kirsten">
            <img className="sprite" src="/assets/kirsten.png" />
          </div>
        </div>
        <Link to="/">
          <img
            className="homeButton"
            id="aboutHomeButton"
            src="/assets/backButton.png"
            onMouseEnter={() => hoverSound.play()}
            onClick={() => buttonSound.play()}
          />
        </Link>
      </center>
    </div>
  )
}

export default About
