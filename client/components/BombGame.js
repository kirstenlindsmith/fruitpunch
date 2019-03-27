/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {RenderPlayBombGame, YouDied} from './index'
import {calculateItemLocation, hitSequence} from './utils'
import {
  gameStarted,
  gameFinished,
  addedBomb,
  killedRiskyItem,
  respawnedRiskyItem,
  gotScore
} from '../store'

const music = new Audio('/assets/CrystalIceArea.mp3')
const buttonSound = new Audio('/assets/buttonPress.mp3')
const hoverSound = new Audio('/assets/buttonHover.mp3')
const boom = new Audio('/assets/bomb.mp3')
const squish = new Audio('/assets/squish.mp3')
let whichBombUserHit

class BombGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      level: 1,
      gameOver: false,
      metGameOverCondition: false,
      gamePaused: false,
      musicPlaying: false,
      isTimerOn: false,
      time: 60000
    }
    
    this.runGame = this.runGame.bind(this)
    this.restartGame = this.restartGame.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.togglePause = this.togglePause.bind(this)
  }

  componentDidMount() {
    music.volume = 0.5
    if (!this.state.musicPlaying) music.play()
    
    this.setState({
      score: 0,
      musicPlaying: true,
      gamePaused: false,
      time: 60000,
      isTimerOn: false
    })
  }

  shouldComponentUpdate() {
    // if there are still any active game items
    return !!this.props.gameItems.length
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
      isTimerOn,
      metGameOverCondition,
      gamePaused,
      gameOver,
      time
    } = this.state

    const {
      gameItems,
      keypoints,
      gameHasStarted,
      toggleEnd,
      explodeItem,
      addBomb,
      removeItem
    } = this.props

    if (!isTimerOn
        && !metGameOverCondition
        && gameHasStarted
        && !gamePaused) this.startTimer()

    if (keypoints.length && !gameOver) {
      for (let i = 0; i < 2; i++) {
        const {
          itemRadius,
          handToItemDistanceL,
          handToItemDistanceR
        } = calculateItemLocation(keypoints, gameItems[i])
        //calculate game item location window

        if (this.props.gameItems[i].type === 'bomb') {
          //despawn bombs after 5 seconds if they aren't hit
          let toRemove = this.props.gameItems[i]
          setTimeout(() => {
            removeItem(toRemove)
          }, 5000)
        }

        if (
          !gameOver
          && gameHasStarted
          && !gamePaused
          && (itemRadius + 50 > handToItemDistanceL //within touching distance
          || itemRadius + 50 > handToItemDistanceR) //of a gameItem
        ) {
          if (this.props.gameItems[i].active) {
            if (this.props.gameItems[i].type !== 'bomb') {
              //if the item is a fruit:
              hitSequence(gameItems[i], squish, explodeItem, removeItem)

              if (!this.state.metDeathCondition) {
                //helps prevent score from going OVER win condition amount
                this.setState(state => ({
                  score: state.score + 10
                }))
              }
            } else {
              //if the player hits a bomb:
              whichBombUserHit = this.props.gameItems[i]
              
              this.setState({
                metGameOverCondition: true,
                gameOver: true,
                level: 1
              })
              
              this.stopTimer()
              boom.play()
              toggleEnd()
              
              let score = this.state.score
              this.props.getFinalScore(score)
            }
          }
        }
      }
      if (time <= 0 && !metGameOverCondition) {
        //if the player survives a full one-minute round
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
      gameOver: false,
      metGameOverCondition: false,
      score: savedScore,
      time: 60000
    })

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
    
    const {
      initialBody,
      gameHasStarted,
      gameItems
    } = this.props
    
    const {
      gameOver,
      score,
      time,
      level,
      gamePaused
    } = this.state
    
    const displayTime = this.msToTime(time)
    const item1 = gameItems[0]
    const item2 = gameItems[1]

    if (initialBody.keypoints && !gameOver && gameHasStarted) {
      return (
        <RenderPlayBombGame
          level={level}
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
      return (
        <YouDied
          level={level}
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
  },
  getFinalScore: score => {
    dispatch(gotScore(score))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(BombGame)
