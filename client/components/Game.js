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

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      won: false
    }
    this.startGame = this.startGame.bind(this)
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
    if (this.props.keypoints.length && !this.state.won) {
      for (let i = 0; i < 2; i++) {
        const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
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
        const distanceR = Math.sqrt(
          Math.pow(rightWristCoords.x - itemCenterX, 2) +
            Math.pow(rightWristCoords.y - itemCenterY, 2)
        )

        const leftWristCoords = findPoint('leftWrist', this.props.keypoints)
        const distanceL = Math.sqrt(
          Math.pow(leftWristCoords.x - itemCenterX, 2) +
            Math.pow(leftWristCoords.y - itemCenterY, 2)
        )

        if (itemRadius > distanceR || itemRadius > distanceL) {
          if (this.props.gameItems[i].active) {
            //explode the item
            this.props.explodeItem(this.props.gameItems[i])
            let toRemove = this.props.gameItems[i]
            setTimeout(() => {
              //retire the item
              this.props.removeGameItem(toRemove)
            }, 260)
            this.setState(state => ({
              score: state.score + 10
            }))
          }
        }
      }
      if (this.state.score >= 500) {
        console.log('YOU WON!!!')
        //explode all the fruits
        for (let i = 0; i < this.props.gameItems.length; i++) {
          this.props.explodeItem(this.props.gameItems[i])
          let toRemove = this.props.gameItems[i]
          setTimeout(() => {
            this.props.removeGameItem(toRemove)
          }, 260)
        }
        this.props.toggleEnd()
        this.setState({
          won: true
        })
      }
    }
  }

  refreshPage() {
    window.location.reload()
  }

  render() {
    if (
      this.props.initialBody.keypoints &&
      !this.state.won &&
      this.props.gameStarted
    ) {
      const item1 = this.props.gameItems[0]
      const item2 = this.props.gameItems[1]

      return (
        <div>
          <div id="score">Score: {this.state.score}</div>
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
          <div id="score">Score: {this.state.score}</div>
          <img id="youWin" src="/assets/win.gif" />
          <img
            id="replayButton"
            src="/assets/replayButton.png"
            onClick={this.refreshPage}
          />
        </div>
      )
    } else return <div />
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints,
  gameItems: state.activeGameItems,
  initialBody: state.initialBody,
  gameStarted: state.gameStarted
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

export default connect(mapStateToProps, mapDispatchToProps)(Game)
