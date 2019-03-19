import React, {Component} from 'react'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {bodyPointLocations, findPoint} from './utils'
import {gotGameItem, removedGameItem, restartItems} from '../store'
// test without bodyPointLocations imported

class Game extends Component {
  // THE GAME
  startGame = () => {
    if (this.props.keypoints.length) {
      const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
      const itemCoords = {
        x: this.state.gameItems[0].x,
        y: this.state.gameItems[0].y
      }

      if (
        rightWristCoords.x <= itemCoords.x &&
        rightWristCoords.x >= itemCoords.x - 50 &&
        (rightWristCoords.y <= itemCoords.y &&
          rightWristCoords.y >= itemCoords.y - 50)
      ) {
        // if (this.props.gameItems[0].imageUrl !== 'https://i.imgur.com/xhRjyzt.png'){
        //   this.setState({
        //     ...this.state,
        //     gameItems: [
        //       {
        //         ...this.state.gameItems[0],
        //         // invisible image
        //         imageUrl: 'https://i.imgur.com/xhRjyzt.png'
        //       }
        //     ]
        //   })
        // }
      }
    }
  }

  render() {
    this.startGame()

    return (
      <div>
        <h1>hit it!</h1>
        {this.state.gameItems.map(item => (
          <GameItem
            key={item.id}
            imageUrl={item.imageUrl}
            x={item.x}
            y={item.y}
          />
        ))}
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
// export default Game
