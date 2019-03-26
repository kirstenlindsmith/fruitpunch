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
    console.log('Active Game', this.state.activeGame)
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
          <div className="leaderboard">
            <h3>Normal Mode: </h3>
            <Leaderboard game="normalGame" activeGame={this.state.activeGame} />
            <h3>Beat the Clock: </h3>
            <Leaderboard game="clockGame" activeGame={this.state.activeGame} />
            <h3>Sudden Death: </h3>
            <Leaderboard game="bombGame" activeGame={this.state.activeGame} />
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
