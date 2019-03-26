/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {
  calculateItemLocation,
  hitSequence,
  winGame,
  increaseLevel
} from './utils'
import {
  killedGameItem,
  respawnedGameItem,
  gameStarted,
  gameFinished,
  addedBomb,
  killedRiskyItem,
  respawnedRiskyItem,
  gotScore
} from '../store'
const music = new Audio('/assets/CrystalIceArea.mp3')
const winSound = new Audio('/assets/winSound.mp3')
const buttonSound = new Audio('/assets/buttonPress.mp3')
const hoverSound = new Audio('/assets/buttonHover.mp3')
const boom = new Audio('/assets/bomb.mp3')
const squish = new Audio('/assets/squish.mp3')
let whichBombUserHit

class Game1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      gamePaused: false,
      musicPlaying: false,
      isClockOn: false,
      metGameOverCondition: false,
      gameOver: false,
      time: 0
    }

    this.runGame = this.runGame.bind(this)
    this.restartGame = this.restartGame.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.startStopwatch = this.startStopwatch.bind(this)
    this.stopStopwatch = this.stopStopwatch.bind(this)
    this.togglePause = this.togglePause.bind(this)
  }

  componentDidMount() {
    music.volume = 0.5
    if (!this.state.musicPlaying) music.play()

    switch (this.props.ruleset) {
      case 'normal':
        this.setState({
          score: 0,
          musicPlaying: true,
          time: 0
        })
        break
      case 'clock':
        this.setState({
          score: 0,
          musicPlaying: true,
          gamePaused: false,
          time: 60000
        })
        break
      case 'bombs':
        this.setState({
          score: 0,
          musicPlaying: true,
          gamePaused: false,
          time: 60000,
          level: 1
        })
        break
      default:
        this.setState({
          score: 0,
          musicPlaying: true,
          time: 0
        })
    }
  }

  shouldComponentUpdate() {
    // if there are still any active game items of the appropriate set
    switch (this.props.ruleset) {
      case 'normal' || 'clock':
        return !!this.props.gameItems.length
      case 'bombs':
        return !!this.props.riskyGameItems.length
      default:
        return !!this.props.gameItems.length
    }
  }

  componentDidUpdate() {
    const {initialBody, gameHasStarted, toggleStart} = this.props
    const {gameOver} = this.state

    if (initialBody.keypoints && !gameOver && !gameHasStarted) {
      setTimeout(() => {
        toggleStart()
      }, 5000)
    }

    this.runGame()
  }

  runGame() {
    const {
      isClockOn,
      metGameOverCondition,
      gamePaused,
      gameOver,
      score,
      time
    } = this.state

    const {
      gameItems,
      riskyGameItems,
      keypoints,
      gameHasStarted,
      explodeItem,
      removeGameItem,
      explodeRiskyItem,
      addBomb,
      removeRiskyItem,
      toggleEnd,
      getFinalScore
    } = this.props

    if (!isClockOn && !metGameOverCondition && gameHasStarted && !gamePaused) {
      if (this.props.ruleset === ('clock' || 'bombs')) {
        this.startTimer()
      } else this.startStopwatch()
    }

    if (keypoints.length && !gameOver) {
      for (let i = 0; i < 2; i++) {
        //calculate object location window
        const {
          itemRadius,
          handToItemDistanceL,
          handToItemDistanceR
        } = calculateItemLocation(keypoints, gameItems[i])

        if (
          !gameOver &&
          !gamePaused &&
          gameHasStarted &&
          !metGameOverCondition &&
          (itemRadius + 50 > handToItemDistanceL ||
            itemRadius + 50 > handToItemDistanceR)
        ) {
          switch (this.props.ruleset) {
            case 'bomb':
              if (riskyGameItems[i].active) {
                hitSequence(
                  riskyGameItems[i],
                  squish,
                  explodeRiskyItem,
                  removeRiskyItem
                )
                if (riskyGameItems[i].type !== 'bomb') {
                  this.setState(state => ({
                    score: state.score + 10
                  }))
                } else {
                  //if a bomb is hit
                  whichBombUserHit = riskyGameItems[i]
                  this.setState({
                    metGameOverCondition: true,
                    gameOver: true,
                    level: 1
                  })
                  this.stopTimer()
                  boom.play()
                  getFinalScore(score)
                  toggleEnd()
                }
              }
              break

            default:
              //for normal mode and beat the clock
              if (gameItems[i].active) {
                hitSequence(gameItems[i], squish, explodeItem, removeGameItem)
                this.setState(state => ({
                  score: state.score + 10
                }))
              }
              break
          }
        }
      }

      //GAME OVER CONDITION
      if (!metGameOverCondition) {
        switch (this.props.ruleset) {
          case 'normal':
            if (score >= 500) {
              winGame(
                music,
                this.stopStopwatch,
                winSound,
                gameItems,
                explodeItem,
                squish,
                getFinalScore
              )
              this.setState({
                metGameOverCondition: true,
                musicPlaying: false
              })
              setTimeout(() => {
                toggleEnd()

                this.setState({
                  gameOver: true
                })
              }, 800)
            }
            break
          case 'clock':
            if (time <= 0) {
              winGame(
                music,
                this.stopTimer,
                winSound,
                gameItems,
                explodeItem,
                squish,
                score,
                getFinalScore
              )
              this.setState({
                metGameOverCondition: true,
                musicPlaying: false
              })
              setTimeout(() => {
                toggleEnd()
                this.setState({
                  gameOver: true
                })
              }, 800)
            }
            break
          case 'bombs':
            if (time <= 0) {
              increaseLevel(
                music,
                this.stopTimer,
                addBomb,
                this.restartGame,
                score
              )
            }
            this.setState({
              musicPlaying: false,
              level: this.state.level + 1
            })
            break
          default:
            if (score >= 500) {
              winGame(
                music,
                this.stopStopwatch,
                winSound,
                gameItems,
                squish,
                score,
                getFinalScore
              )
              this.setState({
                metGameOverCondition: true,
                musicPlaying: false
              })
              setTimeout(() => {
                toggleEnd()

                this.setState({
                  won: true
                })
              }, 800)
            }
        }
      }
    }
  }

  restartGame(savedScore) {
    const {gameItems, removeGameItem, toggleStart} = this.props
    switch (this.props.ruleset) {
      case 'normal':
        this.setState({
          score: 0,
          time: 0,
          start: Date.now()
        })
        for (let i = 0; i < gameItems.length; i++) removeGameItem(gameItems[i])
        break

      case 'clock':
        this.setState({
          score: 0,
          time: 60000
        })
        for (let i = 0; i < gameItems.length; i++) removeGameItem(gameItems[i])
        break

      case 'bombs':
        this.setState({
          score: savedScore,
          time: 60000
        })
        break
      default:
    }

    this.setState({
      gameOver: false,
      metGameOverCondition: false
    })
    toggleStart()
    music.play()
  }

  startTimer() {
    console.log('TIMER STARTED')
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
    //TODO: EACH if/else if/else CONDITION IN RENDER SHOULD BE A SEPERATE COMPONENT!!! makes it more maintainable
    const pauseMenu = this.state.gamePaused ? (
      <div id="pauseScreen" className="center">
        <img className="pausedText" src="/assets/PAUSED.png" />
        <img
          className="continueButton"
          src="/assets/continueButton.png"
          onClick={this.togglePause}
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
    const time = this.msToTime(this.state.time)
    const {initialBody, gameHasStarted, gameItems} = this.props
    const {won, score} = this.state

    if (initialBody.keypoints && !won && gameHasStarted) {
      const item1 = gameItems[0]
      const item2 = gameItems[1]

      return (
        <div>
          <div className="gameInfo">
            <img id="scoreText" src="/assets/score.png" />
            <div id="score">: {score}</div>
            <img id="timeText" src="/assets/timer.png" />
            <div id="time">: {time}</div>
            <img
              id="pauseButton"
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
    } else if (won) {
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
              onMouseEnter={() => hoverSound.play()}
            />
          </div>
          <div className="center">
            <img id="youWin" src="/assets/win.gif" />
            <div id="finalTime">Your time was: {time}</div>
            <img
              id="replayButton"
              src="/assets/replayButton.png"
              className="button"
              onClick={() => {
                buttonSound.play()
                this.restartGame()
              }}
              onMouseEnter={() => hoverSound.play()}
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
  gameItems: state.activeGameItems,
  riskyGameItems: state.riskyGameItems,
  initialBody: state.initialBody,
  gameHasStarted: state.gameStarted,
  canvasContext: state.canvasContext
})

const mapDispatchToProps = dispatch => ({
  explodeItem: item => {
    dispatch(killedGameItem(item))
  },
  removeGameItem: item => {
    dispatch(respawnedGameItem(item))
  },
  addBomb: () => {
    dispatch(addedBomb())
  },
  explodeRiskyItem: item => {
    dispatch(killedRiskyItem(item))
  },
  removeRiskyItem: item => {
    dispatch(respawnedRiskyItem(item))
  },
  toggleStart: () => {
    dispatch(gameStarted())
  },
  toggleEnd: () => {
    dispatch(gameFinished())
  },
  getFinalScore: score => {
    dispatch(gotScore(score))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game1)
