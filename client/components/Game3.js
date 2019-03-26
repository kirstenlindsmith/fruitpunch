/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {findPoint} from './utils'
import {
  gameStarted,
  gameFinished,
  addedBomb,
  killedRiskyItem,
  respawnedRiskyItem
} from '../store'

const music = new Audio('/assets/CrystalIceArea.mp3')
const buttonSound = new Audio('/assets/buttonPress.mp3')
const hoverSound = new Audio('/assets/buttonHover.mp3')
const boom = new Audio('/assets/bomb.mp3')
const squish = new Audio('/assets/squish.mp3')
let whichBombUserHit

class Game3 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      level: 1,
      died: false,
      metDeathCondition: false,
      gamePaused: false,
      musicPlaying: false,
      isTimerOn: false,
      time: 60000
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
      gamePaused: false,
      time: 60000,
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
      !this.state.died &&
      !this.props.gameHasStarted
    ) {
      setTimeout(() => {
        this.props.toggleStart()
      }, 5000)
    }

    this.startGame()
  }

  // THE GAME
  startGame() {
    if (
      !this.state.isTimerOn &&
      !this.state.metDeathCondition &&
      this.props.gameHasStarted &&
      !this.state.gamePaused
    ) {
      this.startTimer()
    }

    const {
      gameItems,
      keypoints,
      gameHasStarted,
      toggleEnd,
      explodeItem,
      addBomb,
      removeItem
    } = this.props

    if (keypoints.length && !this.state.died) {
      for (let i = 0; i < 2; i++) {
        const itemWidth = gameItems[i].width
        const rightWristCoords = findPoint('rightWrist', keypoints)
        const leftWristCoords = findPoint('leftWrist', keypoints)
        const rightElbowCoords = findPoint('rightElbow', this.props.keypoints)
        const leftElbowCoords = findPoint('leftElbow', this.props.keypoints)

        let itemCoords = {
          x: gameItems[i].x,
          y: gameItems[i].y
        }

        const itemRadius = itemWidth * Math.sqrt(2) / 2
        const itemCenterX =
          Math.floor(Math.cos(Math.PI / 4) * itemRadius) + itemCoords.x
        const itemCenterY =
          Math.floor(Math.sin(Math.PI / 4) * itemRadius) + itemCoords.y

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

        if (this.props.gameItems[i].type === 'bomb') {
          let toRemove = this.props.gameItems[i]
          setTimeout(() => {
            removeItem(toRemove)
          }, 5000)
        }

        if (
          !this.state.died &&
          gameHasStarted &&
          !this.state.gamePaused &&
          (itemRadius + 50 > handToItemDistanceL ||
            itemRadius + 50 > handToItemDistanceR)
        ) {
          if (this.props.gameItems[i].active) {
            if (this.props.gameItems[i].type !== 'bomb') {
              //explode the item
              explodeItem(this.props.gameItems[i])
              squish.play()
              let toRemove = this.props.gameItems[i]
              setTimeout(() => {
                //retire the item
                removeItem(toRemove)
              }, 260)
              if (!this.state.metDeathCondition) {
                //helps prevent score from going OVER win condition amount
                this.setState(state => ({
                  score: state.score + 10
                }))
              }
            } else {
              //IF YOU HIT A BOMB:
              whichBombUserHit = this.props.gameItems[i]
              this.setState({
                metDeathCondition: true,
                died: true,
                level: 1
              })
              this.stopTimer()
              boom.play()
              toggleEnd()
            }
          }
        }
      }
      if (this.state.time <= 0 && !this.state.metDeathCondition) {
        console.log('YOU SURVIVED A ROUND!!!')
        music.pause()
        this.stopTimer()
        this.setState({
          musicPlaying: false,
          level: this.state.level + 1
        })
        addBomb()
        this.restartGame(this.state.score)
      }
    }
  }

  restartGame(savedScore) {
    this.setState({
      died: false,
      metDeathCondition: false,
      score: savedScore,
      time: 60000
    })
    //this.props.removeAllBombs()
    this.props.toggleStart()
    music.play()
  }

  startTimer() {
    this.setState({
      isTimerOn: true,
      time: this.state.time
    })
    this.timer = setInterval(
      () =>
        this.setState({
          time: this.state.time - 1000
        }),
      1000
    )
  }

  stopTimer() {
    this.setState({isTimerOn: false})
    clearInterval(this.timer)
  }

  togglePause() {
    if (!this.state.gamePaused) {
      buttonSound.play()
      music.pause()
      this.stopTimer()
      this.setState({
        musicPlaying: false,
        gamePaused: true
      })
    } else {
      buttonSound.play()
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
    const totalFruit = this.state.score / 10 ? this.state.score / 10 : 0
    const time = this.msToTime(this.state.time)
    const pauseMenu = this.state.gamePaused ? (
      <div id="pauseScreen" className="center">
        <img className="pausedText" src="/assets/PAUSED.png" />
        <img
          className="continueButton"
          src="/assets/continueButton.png"
          onClick={this.togglePause}
          onMouseEnter={() => hoverSound.play()}
        />
        <Link to="/select">
          <img
            className="homeButton"
            src="/assets/returnToGameSelectButton.png"
            onMouseEnter={() => hoverSound.play()}
            onClick={() => {
              buttonSound.play()
            }}
          />
        </Link>
      </div>
    ) : null

    if (
      this.props.initialBody.keypoints &&
      !this.state.died &&
      this.props.gameHasStarted
    ) {
      const item1 = this.props.gameItems[0]
      const item2 = this.props.gameItems[1]

      return (
        <div>
          <div className="gameInfo">
            <img id="levelText" src="/assets/level.png" />
            <div id="level">: {this.state.level}</div>
            <img id="scoreText" src="/assets/score.png" />
            <div id="score">: {this.state.score}</div>
            <img id="timeText" src="/assets/timer.png" />
            <div id="time">: {time}</div>
            <img
              id="bombPauseButton"
              src="/assets/pauseButton.png"
              onClick={this.togglePause}
              onMouseEnter={() => hoverSound.play()}
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
    } else if (this.state.died) {
      return (
        <div>
          <div className="gameInfo">
            <img id="levelText" src="/assets/level.png" />
            <div id="level">: {this.state.level}</div>
            <img id="scoreText" src="/assets/score.png" />
            <div id="score">: {this.state.score}</div>
            <img id="timeText" src="/assets/timer.png" />
            <div id="time">: {time}</div>
            <img
              id="bombPauseButton"
              src="/assets/pauseButton.png"
              onClick={this.togglePause}
              onMouseEnter={() => hoverSound.play()}
            />
          </div>
          <GameItem
            imageUrl={whichBombUserHit.explodeUrl}
            x={whichBombUserHit.x}
            y={whichBombUserHit.y}
            width={whichBombUserHit.width}
          />
          <div className="center">
            <img id="youDied" src="/assets/youDied.gif" />
            <div id="finalLevel">
              You got to level {this.state.level} <br />and squished{' '}
              {totalFruit} fruit!
            </div>
            <img
              id="replayButton"
              src="/assets/replayButton.png"
              className="button"
              onMouseEnter={() => hoverSound.play()}
              onClick={() => {
                buttonSound.play()
                this.restartGame()
              }}
            />
            <Link to="/">
              <img
                id="homeButton"
                className="button"
                src="/assets/homeButton.png"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => buttonSound.play()}
              />
            </Link>
          </div>
        </div>
      )
    } else return <div />
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints,
  gameItems: state.riskyGameItems,
  initialBody: state.initialBody,
  gameHasStarted: state.gameStarted,
  canvasContext: state.canvasContext
})

const mapDispatchToProps = dispatch => ({
  toggleStart: () => {
    dispatch(gameStarted())
  },
  toggleEnd: () => {
    dispatch(gameFinished())
  },
  addBomb: () => {
    dispatch(addedBomb())
  },
  explodeItem: item => {
    dispatch(killedRiskyItem(item))
  },
  removeItem: item => {
    dispatch(respawnedRiskyItem(item))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game3)
