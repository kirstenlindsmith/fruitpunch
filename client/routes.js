import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import {About, Camera, Home} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/game" component={Camera} />
        <Route path="/about" component={About} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
