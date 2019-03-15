import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import keyPointReducer from './store'
import {Router} from 'react-router-dom'
import {createStore} from 'redux'
import history from './history'
import App from './app'

const store = createStore(keyPointReducer)

// // establishes socket connection
// import './socket'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)

// ReactDOM.render(<h1>HELLO</h1>, document.getElementById('app'))
