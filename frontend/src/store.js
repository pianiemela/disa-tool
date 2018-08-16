import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import task from './redux/task'
import level from './redux/level'
import category from './redux/category'
import type from './redux/type'
import course from './redux/course'
import selfAssesment from './redux/selfAssesment'
import { userReducer } from './redux/user'
import { userCoursesReducer } from './redux/userCourses'
import { instanceReducer } from './redux/instance'
import listCourses from './redux/listCourses'
import toast from './redux/toast'
import grade from './redux/grade'

const reducers = combineReducers({
  task,
  level,
  category,
  type,
  course,
  selfAssesment,
  user: userReducer,
  courses: userCoursesReducer,
  instance: instanceReducer,
  listCourses,
  toast,
  grade
})

const store = process.env.NODE_ENV === 'development' ?
  createStore(reducers, composeWithDevTools(applyMiddleware(thunk))) :
  createStore(reducers, applyMiddleware(thunk))

export default store
