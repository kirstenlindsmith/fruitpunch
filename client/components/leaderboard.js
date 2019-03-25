import React, {Component} from 'react'
import {loadLeaderboard, sendScore} from '../store'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class Leaderboard extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.props.getLeaderboard()
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const name = evt.target.name.value
    const score = this.props.score
    this.props.addUserScore(name, score)
  }

  render() {
    const leaderboard = this.props.leaderboard
    const score = this.props.score
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
              <button type="submit">Submit</button>
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
            <Link to="/">
              <img id="homeButton" src="/assets/homeButton.png" />
            </Link>
          </div>
        </center>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    leaderboard: state.leaderboard,
    score: state.finalScore
  }
}

const mapDispatchToProps = dispatch => ({
  getLeaderboard: () => {
    dispatch(loadLeaderboard())
  },
  addUserScore: (name, score) => {
    dispatch(sendScore(name, score))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard)
