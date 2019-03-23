/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, {Component} from 'react'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {findPoint} from './utils'
import {
  killedGameItem,
  removedGameItem,
  gameStarted,
  gameFinished
} from '../store'
const music = new Audio('/assets/CrystalIceArea.mp3')
const winSound = new Audio('/assets/winSound.mp3')
const buttonSound = new Audio('/assets/buttonPress.mp3')

class Game1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      won: false,
      metWonCondition: false,
      gamePaused: false,
      musicPlaying: false,
      isTimerOn: false,
      time: 0,
      start: 0
    }
    this.startGame = this.startGame.bind(this)
    this.restartGame = this.restartGame.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.togglePause = this.togglePause.bind(this)
  }

  componentDidMount() {
    music.volume = 0.5
    if (!this.state.musicPlaying) {
      music.play()
    }
    this.setState({
      score: 0,
      musicPlaying: true,
      time: 0,
      isTimerOn: false
    })
  }

  shouldComponentUpdate() {
    //if there are still any active game items...
    return !!this.props.gameItems.length
  }

  componentDidUpdate() {
    if (
      this.props.initialBody.keypoints &&
      !this.state.won &&
      !this.props.gameStarted
    ) {
      setTimeout(() => {
        this.props.toggleStart()
      }, 5000)
    }

    this.startGame()
  }

  // THE GAME
  startGame() {
    const squish = new Audio('/assets/squish.mp3')
    squish.volume = 1

    if (
      !this.state.isTimerOn &&
      !this.state.metWonCondition &&
      this.props.gameStarted &&
      !this.state.gamePaused
    ) {
      this.startTimer()
    }

    if (this.props.keypoints.length && !this.state.won) {
      for (let i = 0; i < 2; i++) {
        const itemCoords = {
          x: this.props.gameItems[i].x,
          y: this.props.gameItems[i].y
        }
        const itemWidth = this.props.gameItems[i].width
        const itemRadius = itemWidth * Math.sqrt(2) / 2
        const itemCenterX =
          Math.floor(Math.cos(Math.PI / 4) * itemRadius) + itemCoords.x
        const itemCenterY =
          Math.floor(Math.sin(Math.PI / 4) * itemRadius) + itemCoords.y

        const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
        const rightElbowCoords = findPoint('rightElbow', this.props.keypoints)
        const yDiffR = rightWristCoords.y - rightElbowCoords.y
        const xDiffR = rightWristCoords.x - rightElbowCoords.x

        let angleR = Math.atan(Math.abs(yDiffR) / Math.abs(xDiffR))
        if (yDiffR >= 0 && xDiffR <= 0) {
          angleR = angleR + Math.PI / 2
        }
        if (xDiffR <= 0 && yDiffR < 0) {
          angleR = angleR + Math.PI
        }

        let yDistanceR = Math.sin(angleR) * 50
        let xDistanceR = Math.cos(angleR) * 50
        let rightHandCoordY = yDistanceR + rightWristCoords.y
        let rightHandCoordX = xDistanceR + rightWristCoords.x

        let handToItemDistanceR = Math.sqrt(
          Math.pow(rightHandCoordX - itemCenterX, 2) +
            Math.pow(rightHandCoordY - itemCenterY, 2)
        )

        const leftWristCoords = findPoint('leftWrist', this.props.keypoints)
        const leftElbowCoords = findPoint('leftElbow', this.props.keypoints)
        const yDiffL = leftWristCoords.y - leftElbowCoords.y
        const xDiffL = leftWristCoords.x - leftElbowCoords.x

        let angleL = Math.atan(Math.abs(yDiffL) / Math.abs(xDiffL))
        if (yDiffL >= 0 && xDiffL <= 0) {
          angleL = angleL + Math.PI / 2
        }
        if (xDiffL <= 0 && yDiffL < 0) {
          angleL = angleL + Math.PI
        }
        if (xDiffL > 0 && yDiffL < 0) {
          angleL = angleL + 3 * Math.PI / 2
        }

        let yDistanceL = Math.sin(angleL) * 50
        let xDistanceL = Math.cos(angleL) * 50
        let leftHandCoordY = yDistanceL + leftWristCoords.y
        let leftHandCoordX = xDistanceL + leftWristCoords.x

        let handToItemDistanceL = Math.sqrt(
          Math.pow(leftHandCoordX - itemCenterX, 2) +
            Math.pow(leftHandCoordY - itemCenterY, 2)
        )

        if (
          !this.state.won &&
          this.props.gameStarted &&
          !this.state.gamePaused &&
          (itemRadius + 50 > handToItemDistanceL ||
            itemRadius + 50 > handToItemDistanceR)
        ) {
          if (this.props.gameItems[i].active) {
            //explode the item
            this.props.explodeItem(this.props.gameItems[i])
            squish.play()
            let toRemove = this.props.gameItems[i]
            setTimeout(() => {
              //retire the item
              this.props.removeGameItem(toRemove)
            }, 260)
            if (!this.state.metWonCondition) {
              //helps prevent score from going OVER win condition amount
              this.setState(state => ({
                score: state.score + 10
              })) //score starts at over 0 for some reason??
            }
          }
        }
      }
      if (this.state.score >= 500 && !this.state.metWonCondition) {
        console.log('YOU WON!!!')
        music.pause()
        this.stopTimer()
        this.setState({
          metWonCondition: true,
          musicPlaying: false
        })
        winSound.play()
        //explode all the fruits
        for (let i = 0; i < this.props.gameItems.length; i++) {
          this.props.explodeItem(this.props.gameItems[i])
        }
        //play squish sound for the two visible fruits on screen
        squish.play()
        squish.play()
        setTimeout(() => {
          this.props.toggleEnd()
          this.setState({
            won: true
          })
        }, 800)
      }
    }
  }

  restartGame() {
    this.setState({
      won: false,
      metWonCondition: false,
      score: 0,
      time: 0,
      start: Date.now()
    })
    for (let i = 0; i < this.props.gameItems.length; i++) {
      this.props.removeGameItem(this.props.gameItems[i])
    }
    this.props.toggleStart()
    music.play()
  }

  startTimer() {
    this.setState({
      isTimerOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })
    this.timer = setInterval(
      () =>
        this.setState({
          time: Date.now() - this.state.start
        }),
      1000
    )
  }

  stopTimer() {
    this.setState({isTimerOn: false})
    clearInterval(this.timer)
  }

  togglePause() {
    buttonSound.play()
    if (!this.state.gamePaused) {
      music.pause()
      this.stopTimer()
      this.setState({
        musicPlaying: false,
        gamePaused: true
      })
    } else {
      music.play()
      this.startTimer()
      this.setState({
        musicPlaying: true,
        gamePaused: false
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  msToTime(givenTime) {
    let seconds = parseInt((givenTime / 1000) % 60)
    let minutes = parseInt((givenTime / (1000 * 60)) % 60)

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    return minutes + ':' + seconds
  }

  render() {
    const pauseMenu = this.state.gamePaused ? (
      <div id="pauseScreen" className="center">
        <img className="pausedText" src="/assets/PAUSED.png" />
        <img
          className="continueButton"
          src="/assets/continueButton.png"
          onClick={this.togglePause}
        />
        <a href="/select">
          <img
            className="homeButton"
            src="/assets/returnToGameSelectButton.png"
          />
        </a>
      </div>
    ) : null
    const time = this.msToTime(this.state.time)

    if (
      this.props.initialBody.keypoints &&
      !this.state.won &&
      this.props.gameStarted
    ) {
      const item1 = this.props.gameItems[0]
      const item2 = this.props.gameItems[1]

      return (
        <div>
          <div className="gameInfo">
            <img id="scoreText" src="/assets/score.png" />
            <div id="score">: {this.state.score}</div>
            <img id="timeText" src="/assets/timer.png" />
            <div id="time">: {time}</div>
            <img
              id="pauseButton"
              src="/assets/pauseButton.png"
              onClick={this.togglePause}
            />
          </div>
          <div className="center">{pauseMenu}</div>
          <div>
            <GameItem
              key={item1.id}
              imageUrl={item1.imageUrl}
              x={item1.x}
              y={item1.y}
              width={item1.width}
            />

            <GameItem
              key={item2.id}
              imageUrl={item2.imageUrl}
              x={item2.x}
              y={item2.y}
              width={item2.width}
            />
          </div>
        </div>
      )
    } else if (this.state.won) {
      return (
        <div>
          <div className="gameInfo">
            <div id="score">
              <img id="scoreText" src="/assets/score.png" /> :{' '}
              {this.state.score}
            </div>
          </div>
          <div className="center">
            <img id="youWin" src="/assets/win.gif" />
            <div id="finalTime">Your time was: {time}</div>
            <img
              id="replayButton"
              src="/assets/replayButton.png"
              className="button"
              onClick={this.restartGame}
            />
            <a href="/">
              <img
                id="homeButton"
                className="button"
                src="/assets/homeButton.png"
              />
            </a>
          </div>
        </div>
      )
    } else return <div />
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints,
  gameItems: state.activeGameItems,
  initialBody: state.initialBody,
  gameStarted: state.gameStarted,
  canvasContext: state.canvasContext
})

const mapDispatchToProps = dispatch => ({
  explodeItem: item => {
    dispatch(killedGameItem(item))
  },
  removeGameItem: item => {
    dispatch(removedGameItem(item))
  },
  toggleStart: () => {
    dispatch(gameStarted())
  },
  toggleEnd: () => {
    dispatch(gameFinished())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game1)
