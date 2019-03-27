import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Leaderboard from './Leaderboard'

class Leaderboards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeGame: ''
    }
  }

  componentDidMount() {
    if (this.props.location.state) {
      const location = this.props.location.state
      if (location.fromClockGame) {
        this.setState({activeGame: 'clockGame'})
      }
      if (location.fromNormalGame) {
        this.setState({activeGame: 'normalGame'})
      }
      if (location.fromBombGame) {
        this.setState({activeGame: 'bombGame'})
      }
    }
  }

  render() {
    const buttonSound = new Audio('/assets/buttonPress.mp3')
    const hoverSound = new Audio('/assets/buttonHover.mp3')
    return (
      <div>
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
        <div>
          <img
            id="hallOfFame"
            className="center"
            src="/assets/hallOfFame.png"
          />
          <div className="leaderboard">
            <div className="oneBoard">
              <a href="/game1">
                <button
                  type="button"
                  className="leaderboardGameButton"
                  id="normalModeLeaderboard"
                  onMouseEnter={() => hoverSound.play()}
                  onClick={() => buttonSound.play()}
                >
                  Normal Mode
                </button>
              </a>
              <div className="boardComp">
                <Leaderboard
                  game="normalGame"
                  activeGame={this.state.activeGame}
                />
              </div>
            </div>
            <div className="oneBoard">
              <a href="/game2">
                <button
                  type="button"
                  id="beatTheClockLeaderboard"
                  className="leaderboardGameButton"
                  onMouseEnter={() => hoverSound.play()}
                  onClick={() => buttonSound.play()}
                >
                  Beat The Clock
                </button>
              </a>
              <div className="boardComp">
                <Leaderboard
                  game="clockGame"
                  activeGame={this.state.activeGame}
                />
              </div>
            </div>
            <div className="oneBoard">
              <a href="/game3">
                <button
                  type="button"
                  id="suddenDeathLeaderboard"
                  className="leaderboardGameButton"
                  onMouseEnter={() => hoverSound.play()}
                  onClick={() => buttonSound.play()}
                >
                  Sudden Death
                </button>
              </a>
              <div className="boardComp">
                <Leaderboard
                  game="bombGame"
                  activeGame={this.state.activeGame}
                />
              </div>
            </div>
          </div>
          <Link to="/">
            <img
              id="leaderboardHomeButton"
              className="homeButton"
              src="/assets/homeButton.png"
              onMouseEnter={() => hoverSound.play()}
              onClick={() => buttonSound.play()}
            />
          </Link>
        </div>
      </div>
    )
  }
}

export default Leaderboards
