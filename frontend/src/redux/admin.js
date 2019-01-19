
import * as types from './action_types'

const INITIAL_STATE = {
  users: []
}

const adminReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADMIN_GET_USERS:
      return {
        ...state,
        users: action.response
      }
    case types.ADMIN_CHANGE_ROLE:
      return {
        ...state,
        users: state.users.map(user => (user.id === action.response.data.id ? {
          ...user,
          role: action.response.data.role
        } : user))
      }
    case types.ADMIN_COURSE_CHANGE_ROLE:
      return {
        ...state,
        users: state.users.map(user => (user.id === action.response.data.person_id ? {
          ...user,
          course_people: user.course_people.map((
            cp => (cp.course_instance_id === action.response.data.course_instance_id ? {
              ...cp,
              role: action.response.data.role
            } : cp)
          ))
        } : user))
      }
    case types.ADMIN_ADD_TO_COURSE:
      return {
        ...state,
        users: state.users.map(user => (user.id === action.response.data.person_id ? {
          ...user,
          course_people: [...user.course_people, {
            ...action.response.data,
            course_instance: action.course_instance
          }]
        } : user))
      }
    case types.ADMIN_DELETE_ROLE:
      return {
        ...state,
        users: state.users.map(user => (user.id === action.response.deleted.person_id ? {
          ...user,
          course_people: user.course_people.filter(cp => cp.id !== action.response.deleted.id)
        } : user))
      }
    case types.ADMIN_RESET:
      return INITIAL_STATE
    default:
      return state
  }
}

export default adminReducer
