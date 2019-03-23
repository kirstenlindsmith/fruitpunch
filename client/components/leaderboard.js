import React, {Component} from 'react'
import {loadLeaderboard} from '../store'
import {connect} from 'react-redux'

class Leaderboard extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getLeaderboard()
  }

  render() {
    const leaderboard = this.props.leaderboard
    const score = this.props.score
    console.log(this.props.score)
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
            <p>{score}</p>
            <form onSubmit={this.handleSubmit}>
              <label>Submit 3 Letter Name:</label>
              <input type="text" name="name" />
            </form>
            <div id="highscores">
              High Scores:{' '}
              {leaderboard.map(player => (
                <div key={player.id}>
                  <p>
                    {player.name}: {player.score}
                  </p>
                </div>
              ))}
            </div>
            <a href="/">
              <img id="homeButton" src="/assets/homeButton.png" />
            </a>
          </div>
        </center>
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log(state)
  return {
    leaderboard: state.leaderboard,
    score: state.finalScore
  }
}

const mapDispatchToProps = dispatch => ({
  getLeaderboard: () => {
    dispatch(loadLeaderboard())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard)
