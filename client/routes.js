import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import {
  About,
  Camera,
  Home,
  Game,
  BombGame,
  GameSelect,
  Leaderboards,
  NoMatch
} from './components/routeComponents'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/select" component={GameSelect} />
        <Route path="/leaderboard" component={Leaderboards} />
        <Route
          exact
          path="/game1"
          render={() => <Camera render={() => <Game ruleset="normal" />} />}
        />
        <Route
          exact
          path="/game2"
          render={() => <Camera render={() => <Game ruleset="clock" />} />}
        />
        <Route
          exact
          path="/game3"
          render={() => <Camera render={() => <BombGame />} />}
        />
        <Route path="/about" component={About} />
        <Route path="*" component={NoMatch} status={404} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
