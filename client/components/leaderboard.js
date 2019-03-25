import React, {Component} from 'react'
import {loadLeaderboard, sendScore} from '../store'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

let formClassName
let fillerClassName = 'noShow'

class Leaderboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      interactedWith: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.isNameValid = this.isNameValid.bind(this)
    this.shouldNameMarkError = this.shouldNameMarkError.bind(this)
    this.handleBlurWhenInteracting = this.handleBlurWhenInteracting.bind(this)
  }

  componentDidMount() {
    this.props.getLeaderboard()
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const name = evt.target.name.value
    const score = this.props.score
    this.props.addUserScore(name, score)
    formClassName = 'noShow'
    fillerClassName = ''
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  isNameValid() {
    const {name} = this.state
    return name.length === 3
  }

  shouldNameMarkError() {
    const hasError = !this.isNameValid()
    const shouldDisplayError = this.state.interactedWith

    return hasError ? shouldDisplayError : false
  }

  handleBlurWhenInteracting() {
    return () => {
      this.setState({
        interactedWith: true
      })
    }
  }

  render() {
    const isButtonWorking = this.isNameValid()
    const isNameWarningDisplayed = this.shouldNameMarkError()
      ? 'errorWarning'
      : 'noShow'
    const errorDisplay = this.shouldNameMarkError() ? 'fieldError' : ''
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
            <div id="scoreSubmitSpaceFiller" className={fillerClassName} />
            <div id="scoreSubmitForm" className={formClassName}>
              <p>Your Score: {score}</p>
              <span className={isNameWarningDisplayed}>
                Must be exactly 3 letters
              </span>
              <form onSubmit={this.handleSubmit}>
                <label>Nickname: </label>
                <input
                  type="text"
                  name="name"
                  onChange={this.handleNameChange}
                  className={errorDisplay}
                  onBlur={this.handleBlurWhenInteracting()}
                />
                <button
                  type="submit"
                  id="leaderBoardButton"
                  disabled={!isButtonWorking}
                >
                  submit
                </button>
              </form>
            </div>
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
