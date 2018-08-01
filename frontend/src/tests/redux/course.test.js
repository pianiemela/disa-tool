import deepFreeze from 'deep-freeze'
import courseReducer from '../../redux/course'

const INITIAL_STATE = {
  editing: false,
  course: {},
  loading: true
}

const courseGetDataResponse = {
  message: 'test message',
  data: {
    course: {
      id: 10,
      name: 'course0'
    }
  }
}

const courseGetDataExpectation = {
  editing: false,
  course: {
    id: 10,
    name: 'course0'
  },
  loading: false
}

describe('course reducer', () => {
  let state

  beforeEach(() => {
    state = INITIAL_STATE
    deepFreeze(state)
  })

  it('parses data from COURSE_GET_DATA.', () => {
    state = courseReducer(state, {
      type: 'COURSE_GET_DATA',
      response: courseGetDataResponse
    })
    expect(state).toEqual(courseGetDataExpectation)
  })
})
