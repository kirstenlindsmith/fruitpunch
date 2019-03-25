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
          volume="0.1"
        />
      </audio>
      <center>
        <div id="aboutTheGame">
          <img src="/assets/aboutTheGame.gif" />
          <div className="aboutText">
            <p>
              This series of awesomely fun games was made created using PoseNet
              via TensorFlowjs, and rendered with React.
              <br />
              <br />
              Music credits:
            </p>
            <ul>
              <li>
                <i>The Wonderful Star's Walk is Wonderful</i>, from Katamari
                Damacy
              </li>
              <li>
                <i>Crystal Ice Area</i>, from Kirby & The Amazing Mirror
              </li>
              <li>
                <i>Lazy Afternoons</i>, from Kingdom Hearts II
              </li>
            </ul>
            <a href="https://github.com/team-siren/fruit-punch">
              <button
                type="button"
                id="githubButton"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              >
                View on Github
              </button>
            </a>
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
