import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import {About, Camera, Home, Game1, Game2, GameSelect} from './components'
import Leaderboard from './components/leaderboard'

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
          render={props => <Camera {...props} game={Game1} />}
        />
        <Route
          exact
          path="/game2"
          render={props => <Camera {...props} game={Game2} />}
        />
        <Route path="/about" component={About} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
