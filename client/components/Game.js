/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  RenderPlayGame,
  RenderPlayBombGame,
  WinGame,
  TimesUp,
  YouDied
} from './index'
import {
  calculateItemLocation,
  hitSequence,
  winGame,
  increaseLevel,
  pauseMenuDiv
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
      time: 0,
      level: 1
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
        break
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
        return true
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
      if (this.props.ruleset === 'clock' || this.props.ruleset === 'bombs') {
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
        const {ruleset} = this.props

        if (
          !gameOver &&
          !gamePaused &&
          gameHasStarted &&
          !metGameOverCondition &&
          (itemRadius + 50 > handToItemDistanceL ||
            itemRadius + 50 > handToItemDistanceR)
        ) {
          console.log('met proximity case')
          if (ruleset === 'bombs') {
            console.log('array', riskyGameItems)
            if (riskyGameItems[i].active) {
              console.log('item is active')
              if (riskyGameItems[i].type !== 'bomb') {
                //if it's a fruit
                hitSequence(
                  riskyGameItems[i],
                  squish,
                  explodeRiskyItem,
                  removeRiskyItem
                )
                // explodeRiskyItem(gameItems[i])
                // squish.play()
                // let toRemove = gameItems[i]
                // setTimeout(() => {
                //   removeRiskyItem(toRemove)
                // }, 260)
                this.setState(state => ({
                  score: state.score + 10
                }))
              } else {
                //if a bomb is hit
                whichBombUserHit = riskyGameItems[i]
                this.setState({
                  metGameOverCondition: true,
                  gameOver: true
                })
                this.stopTimer()
                boom.play()
                getFinalScore(score)
                toggleEnd()
              }
            }
          } else {
            //if ruleset is normal or clock
            if (gameItems[i].active) {
              hitSequence(gameItems[i], squish, explodeItem, removeGameItem)
              this.setState({
                score: this.state.score + 10
              })
            }
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

              this.setState({
                musicPlaying: false,
                level: this.state.level + 1
              })
            }
            break
          default:
            break
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
    if (this.props.ruleset === 'normal') {
      clearInterval(this.stopwatch)
    } else clearInterval(this.timer)
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
    const {initialBody, gameHasStarted, gameItems, riskyGameItems} = this.props
    const {gameOver, score, time, level, gamePaused} = this.state
    const displayTime = this.msToTime(time)
    let item1, item2

    if (initialBody.keypoints && !gameOver && gameHasStarted) {
      if (this.props.ruleset === 'bombs') {
        item1 = riskyGameItems[0]
        item2 = riskyGameItems[1]

        return (
          <RenderPlayBombGame
            level={level}
            score={score}
            time={displayTime}
            togglepause={this.togglePause}
            hoversound={hoverSound}
            pausestatus={gamePaused}
            item1={item1}
            item2={item2}
          />
        )
      } else {
        item1 = gameItems[0]
        item2 = gameItems[1]

        return (
          <RenderPlayGame
            score={score}
            time={displayTime}
            togglepause={this.togglePause}
            hoversound={hoverSound}
            pausestatus={gamePaused}
            item1={item1}
            item2={item2}
          />
        )
      }
    } else if (gameOver) {
      switch (this.props.ruleset) {
        case 'normal':
          return (
            <WinGame
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

        case 'bombs':
          return (
            <YouDied
              level={this.state.level}
              score={score}
              time={displayTime}
              togglepause={this.togglePause}
              hoversound={hoverSound}
              buttonsound={buttonSound}
              whichbombuserhit={whichBombUserHit}
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

export default connect(mapStateToProps, mapDispatchToProps)(Game)
