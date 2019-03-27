/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {RenderPlayGame, YouWin, TimesUp} from './index'
import {calculateItemLocation, hitSequence, finishGame} from '../../utils'
import {
  killedGameItem,
  respawnedGameItem,
  gameStarted,
  gameFinished,
  gotScore
} from '../../store'

const music = new Audio('/assets/audio/CrystalIceArea.mp3')
const winSound = new Audio('/assets/audio/winSound.mp3')
const buttonSound = new Audio('/assets/audio/buttonPress.mp3')
const hoverSound = new Audio('/assets/audio/buttonHover.mp3')
const squish = new Audio('/assets/audio/squish.mp3')

class Game extends Component {
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
          gamePaused: false,
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
      default:
        break
    }
  }

  shouldComponentUpdate() {
    // if there are still any active game items of the appropriate set
    return !!this.props.gameItems.length
  }

  componentDidUpdate() {
    const {gameOver} = this.state
    const {initialBody, gameHasStarted, toggleStart} = this.props

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
      keypoints,
      gameHasStarted,
      explodeItem,
      removeGameItem,
      toggleEnd,
      getFinalScore
    } = this.props

    if (!isClockOn && !metGameOverCondition && gameHasStarted && !gamePaused) {
      if (this.props.ruleset === 'clock') this.startTimer()
      else this.startStopwatch()
    }

    if (keypoints.length && !gameOver) {
      for (let i = 0; i < 2; i++) {
        const {
          itemRadius,
          handToItemDistanceL,
          handToItemDistanceR
        } = calculateItemLocation(keypoints, gameItems[i])
        //calculate game item location window

        if (
          !gameOver &&
          !gamePaused &&
          gameHasStarted &&
          !metGameOverCondition &&
          (itemRadius + 50 > handToItemDistanceL ||
            itemRadius + 50 > handToItemDistanceR)
        ) {
          if (gameItems[i].active) {
            hitSequence(gameItems[i], squish, explodeItem, removeGameItem)

            this.setState({
              score: this.state.score + 10
            })
          }
        }
      }

      // winning conditions
      if (!metGameOverCondition) {
        switch (this.props.ruleset) {
          case 'normal':
            if (score >= 500) {
              finishGame(
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

              let normalScore = this.msToTime(this.state.time)
              this.props.getFinalScore(normalScore)
            }
            break

          case 'clock':
            if (time <= 0) {
              finishGame(
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

              let clockScore = this.state.score
              this.props.getFinalScore(clockScore)
            }
            break
          default:
            break
        }
      }
    }
  }

  restartGame() {
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
      default:
        break
    }

    this.setState({
      gameOver: false,
      metGameOverCondition: false
    })

    toggleStart()
    music.play()
  }

  startStopwatch() {
    this.setState({
      isClockOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })

    this.stopwatch = setInterval(
      () =>
        this.setState({
          time: Date.now() - this.state.start
        }),
      1000
    )
  }

  stopStopwatch() {
    this.setState({isClockOn: false})
    clearInterval(this.stopwatch)
  }

  startTimer() {
    this.setState({
      isClockOn: true,
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
    this.setState({isClockOn: false})
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
    if (this.props.ruleset === 'normal') clearInterval(this.stopwatch)
    else clearInterval(this.timer)
  }

  msToTime(givenTime) {
    let seconds = parseInt((givenTime / 1000) % 60)
    let minutes = parseInt((givenTime / (1000 * 60)) % 60)

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    return minutes + ':' + seconds
  }

  render() {
    const finalTime = this.msToTime(this.state.time)
    const totalFruit = this.state.score / 10

    const {initialBody, gameHasStarted, gameItems} = this.props

    const {gameOver, score, time, gamePaused} = this.state

    const displayTime = this.msToTime(time)
    const item1 = gameItems[0]
    const item2 = gameItems[1]

    if (initialBody.keypoints && !gameOver && gameHasStarted) {
      return (
        <RenderPlayGame
          score={score}
          time={displayTime}
          togglepause={this.togglePause}
          hoversound={hoverSound}
          buttonsound={buttonSound}
          pausestatus={gamePaused}
          item1={item1}
          item2={item2}
        />
      )
    } else if (gameOver) {
      switch (this.props.ruleset) {
        case 'normal':
          return (
            <YouWin
              score={score}
              time={displayTime}
              togglepause={this.togglePause}
              hoversound={hoverSound}
              buttonsound={buttonSound}
              finaltime={finalTime}
              restartgame={this.restartGame}
            />
          )

        case 'clock':
          return (
            <TimesUp
              score={score}
              time={displayTime}
              togglepause={this.togglePause}
              hoversound={hoverSound}
              buttonsound={buttonSound}
              totalfruit={totalFruit}
              restartgame={this.restartGame}
            />
          )

        default:
          return <div />
      }
    } else return <div />
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints,
  gameItems: state.activeGameItems,
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

export default connect(mapStateToProps, mapDispatchToProps)(Game)
