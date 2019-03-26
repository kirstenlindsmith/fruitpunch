import React, {Component} from 'react'
import {loadLeaderboard, sendScore} from '../store'
import {connect} from 'react-redux'
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
          <h1 className="center aboutPage">All-Time High Scores</h1>
          <div className="leaderboard">
            <div className="oneBoard">
              <h3>Normal Mode: </h3>
              <div className="boardComp">
                <Leaderboard
                  game="normalGame"
                  activeGame={this.state.activeGame}
                />
              </div>
            </div>
            <div className="oneBoard">
              <h3>Beat the Clock: </h3>
              <div className="boardComp">
                <Leaderboard
                  game="clockGame"
                  activeGame={this.state.activeGame}
                />
              </div>
            </div>
            <div className="oneBoard">
              <h3>Sudden Death: </h3>
              <div className="boardComp">
                <Leaderboard
                  game="bombGame"
                  activeGame={this.state.activeGame}
                />
              </div>
            </div>
          </div>
          <div className="center aboutPage">
            <Link to="/">
              <img id="homeButton" src="/assets/homeButton.png" />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboards)
