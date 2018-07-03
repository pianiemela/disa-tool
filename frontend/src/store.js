import { createStore, combineReducers } from 'redux'

import task from './containers/Course/reducers/taskReducer'
import skill from './containers/Course/reducers/skillReducer'
import level from './containers/Course/reducers/levelReducer'
import category from './containers/Course/reducers/categoryReducer'

const reducer = combineReducers({
  task,
  skill,
  level,
  category
})

const store = createStore(reducer)

export default store