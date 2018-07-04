import { createStore, combineReducers, compose } from 'redux'

import task from './containers/Course/reducers/taskReducer'
import skill from './containers/Course/reducers/skillReducer'
import createForm from './containers/SelfAssesment/reducers/createFormReducer'
import { composeWithDevTools } from 'redux-devtools-extension';


const reducer = combineReducers({
  task,
  skill,
  createForm
})

const store = createStore(reducer, composeWithDevTools())

export default store