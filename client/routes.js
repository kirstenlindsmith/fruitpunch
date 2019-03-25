import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import {
  About,
  Camera,
  Home,
  Game1,
  Game2,
  Game3,
  GameSelect,
  Leaderboard,
  NoMatch
} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/select" component={GameSelect} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route
          exact
          path="/game1"
          render={() => <Camera game={Game1} />}
          //{() => <Camera render={()=> <Game ruleset={'normal' || 'clock' || 'bombs'}}
          //Game component has ruleset for all games, and switch cases inside render and runGame()
          //camera just needs this.props.render()
        />
        <Route exact path="/game2" render={() => <Camera game={Game2} />} />
        <Route exact path="/game3" render={() => <Camera game={Game3} />} />
        <Route path="/about" component={About} />
        <Route path="*" component={NoMatch} status={404} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
