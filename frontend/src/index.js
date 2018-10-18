import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import * as Sentry from '@sentry/browser'

import App from './App'

import store from './store'

try {
  Sentry.init({ dsn: 'https://3936f4ca15844c059959d21c01d5e401@toska.cs.helsinki.fi/7' }) // eslint-disable-line
} catch (e) {
  console.log(e)
} // eslint-disable-line


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.getElementById('app')
)
