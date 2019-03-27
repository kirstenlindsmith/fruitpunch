import React, {Component} from 'react'
import {loadLeaderboard, sendScore} from '../store'
import {connect} from 'react-redux'

let formClassName
let fillerClassName = 'noShow'

class Leaderboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      interactedWith: false,
      chosenIsActive: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.isNameValid = this.isNameValid.bind(this)
    this.shouldNameMarkError = this.shouldNameMarkError.bind(this)
    this.handleBlurWhenInteracting = this.handleBlurWhenInteracting.bind(this)
  }

  componentDidMount() {
    const chosenGame = this.props.game
    this.props.getLeaderboard(chosenGame)
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.activeGame !== this.props.activeGame &&
      this.props.activeGame === this.props.game &&
      this.props.score !== 0
    ) {
      this.setState({chosenIsActive: true})
    }
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const name = evt.target.name.value
    const score = this.props.score
    const game = this.props.game
    this.props.addUserScore(name, score, game)
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
    const errorDisplay = this.shouldNameMarkError() ? 'fieldError' : ''
    const allLeaderboards = this.props.leaderboard
    const chosenGame = this.props.game
    const leaderboard = allLeaderboards[chosenGame]
    const score = this.props.score
    return (
      <div className="scoreComp">
        <div id="highscores">
          {leaderboard.map(player => (
            <div className="playerScore" key={player.id}>
              <p>
                {player.name}: {player.score}
              </p>
            </div>
          ))}
        </div>
        <div>
          {this.state.chosenIsActive ? (
            <div id="formContainer" className="center">
              <div id="scoreSubmitForm" className={formClassName}>
                <p>Your Score: {score}</p>
                <form onSubmit={this.handleSubmit}>
                  <label>Nickname: </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="must be 3 characters"
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
              <div id="spaceChanger" className={fillerClassName} />
            </div>
          ) : (
            <div id="scoreSubmitSpaceFiller" />
          )}
        </div>
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
  getLeaderboard: game => {
    dispatch(loadLeaderboard(game))
  },
  addUserScore: (name, score, game) => {
    dispatch(sendScore(name, score, game))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard)
