import { createStore, combineReducers } from 'redux'

import task from './containers/Course/reducers/taskReducer'
import objective from './containers/Course/reducers/objectiveReducer'
import level from './containers/Course/reducers/levelReducer'
import category from './containers/Course/reducers/categoryReducer'

const reducer = combineReducers({
  task,
  objective,
  level,
  category
})

const store = createStore(reducer)

export default store