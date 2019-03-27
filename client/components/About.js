import React from 'react'
import {Link} from 'react-router-dom'
import {Link as ScrollLink} from 'react-scroll'

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
          <ScrollLink
            className="scrollButton"
            to="aboutUs"
            spy={true}
            smooth={true}
            offset={50}
            duration={500}
          >
            <button id="aboutToBottomButton" className="scrollButton">
              ⬇
            </button>
          </ScrollLink>
          <div className="aboutText">
            <h1>Rules</h1>
            <p>
              <b>Normal Mode:</b>
              <br />Familiarize yourself with the game! <br />See how fast it
              takes you to squish 50 fruits! <br />
              <br />
              <b>Beat The Clock:</b>
              <br />Now you're on a time limit. <br />See how many fruits you
              can destroy in just one minute! <br />
              <br />
              <b>Sudden Death:</b>
              <br />Classic time trial with a dangerous twist. <br />Avoid the
              bombs while squishing the fruit! <br />
              <br />
              After each game you have the option to add your <br />personal
              high score to our{' '}
              <b>
                <a href="/leaderboard">leaderboard</a>
              </b>. Good luck!
            </p>
            <h1>Creation</h1>
            <p>
              This series of awesomely fun games was made created using PoseNet
              via TensorFlowjs, and rendered with React.
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
              <br />
            </p>
            <h3>Music Credits</h3>
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
        <div id="aboutBottomButtons">
          <Link to="/">
            <img
              className="homeButton"
              id="aboutHomeButton"
              src="/assets/homeButton.png"
              onMouseEnter={() => hoverSound.play()}
              onClick={() => buttonSound.play()}
            />
          </Link>
          <ScrollLink
            className="scrollButton"
            to="aboutTheGame"
            spy={true}
            smooth={true}
            duration={500}
          >
            <button id="aboutToTopButton" className="scrollButton">
              ⬆
            </button>
          </ScrollLink>
        </div>
      </center>
    </div>
  )
}

export default About
