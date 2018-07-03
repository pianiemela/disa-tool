import { createStore, combineReducers } from 'redux'

import task from './containers/Course/reducers/taskReducer'
import skill from './containers/Course/reducers/skillReducer'

const reducer = combineReducers({
  task,
  skill
})

const store = createStore(reducer)

export default store