import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import Home from './components/Home'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <div>
        {/* <Switch> */}
        <Route path="/" component={Home} key="home" />
        {/* </Switch> */}
      </div>
    )
  }
}

export default withRouter(Routes)
