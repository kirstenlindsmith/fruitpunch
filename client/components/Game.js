import React, {Component} from 'react'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {bodyPointLocations, findPoint} from './utils'
import {gotGameItem, removedGameItem, restartItems} from '../store'
// test without bodyPointLocations imported

class Game extends Component {
  constructor(props) {
    super(props)

    this.startGame = this.startGame.bind(this)
    this.restartGame = this.restartGame.bind(this)
  }
  // THE GAME
  startGame() {
    console.log('game started!')
    if (this.props.keypoints.length) {
      const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
      const itemCoords = {
        x: this.props.gameItems[0].x,
        y: this.props.gameItems[0].y
      }

      if (
        rightWristCoords.x <= itemCoords.x &&
        rightWristCoords.x >= itemCoords.x - 50 &&
        (rightWristCoords.y <= itemCoords.y &&
          rightWristCoords.y >= itemCoords.y - 50)
      ) {
        //retire the item
        console.log('hit it!!!')
        this.props.removeGameItem(this.props.gameItems[0])
      }
    }
  }

  restartGame() {
    console.log('game restarted')
    this.props.respawnItems()
  }

  render() {
    const buttonStyle = {
      position: 'fixed',
      top: 700
    }

    return (
      <div>
        <h1>hit it!</h1>
        {this.props.gameItems.map(item => {
          return (
            <GameItem
              key={item.id}
              imageUrl={item.imageUrl}
              x={item.x} //these are correct
              y={item.y}
            />
          )
        })}
        <div
          id="start_restart_buttons"
          // style={buttonStyle}
        >
          <button
            type="button"
            onClick={this.startGame} //only calls the function ONCE
          >
            START
          </button>{' '}
          <button type="button" onClick={this.restartGame}>
            RESTART
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints,
  gameItems: state.activeGameItems
})

const mapDispatchToProps = dispatch => ({
  removeGameItem: item => {
    dispatch(removedGameItem(item))
  },
  respawnItems: () => {
    dispatch(restartItems())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)
