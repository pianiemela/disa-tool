import { createStore, combineReducers } from 'redux'

import task from './containers/Course/reducers/taskReducer'
import objective from './containers/Course/reducers/objectiveReducer'
import level from './containers/Course/reducers/levelReducer'
import category from './containers/Course/reducers/categoryReducer'
import type from './containers/Course/reducers/typeReducer'
import createForm from './containers/SelfAssesment/reducers/createFormReducer'

const reducer = combineReducers({
  task,
  objective,
  level,
  category,
  type,
  createForm
})

const store = createStore(reducer)

export default store