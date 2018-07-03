import { createStore, combineReducers } from 'redux'

import task from './containers/Course/reducers/taskReducer'
import skill from './containers/Course/reducers/skillReducer'
import createForm from './containers/SelfAssesment/reducers/createFormReducer'

const reducer = combineReducers({
  task,
  skill,
  createForm
})

const store = createStore(reducer)

export default store