import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import task from './containers/Course/reducers/taskReducer'
import objective from './containers/Course/reducers/objectiveReducer'
import level from './containers/Course/reducers/levelReducer'
import category from './containers/Course/reducers/categoryReducer'
import type from './containers/Course/reducers/typeReducer'
import course from './containers/Course/reducers/courseReducer'
import createForm from './containers/SelfAssesment/reducers/createFormReducer'
import { userReducer } from './redux/user'

const reducers = combineReducers({
  task,
  objective,
  level,
  category,
  type,
  course,
  createForm,
  user: userReducer
})

const store = process.env.NODE_ENV === 'development' ?
  createStore(reducers, composeWithDevTools(applyMiddleware(thunk))) :
  createStore(reducers)

export default store
