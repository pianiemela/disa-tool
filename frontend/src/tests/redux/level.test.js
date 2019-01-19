import deepFreeze from 'deep-freeze'
import levelReducer from '../../redux/level'
import * as types from '../../redux/action_types'

const INITIAL_STATE = {
  levels: []
}

const courseGetDataResponse = {
  message: 'test message',
  data: {
    levels: [
      {
        id: 10,
        name: 'sl0'
      },
      {
        id: 11,
        name: 'sl1'
      }
    ]
  }
}

const courseGetDataExpectation = {
  levels: [
    {
      id: 10,
      name: 'sl0'
    },
    {
      id: 11,
      name: 'sl1'
    }
  ]
}

const levelCreateResponse = {
  message: 'test_message',
  created: {
    id: 20,
    name: 'sl10'
  }
}

const levelCreateExpectation = {
  levels: [
    {
      id: 10,
      name: 'sl0'
    },
    {
      id: 11,
      name: 'sl1'
    },
    {
      id: 20,
      name: 'sl10'
    }
  ]
}

const levelDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 11
  }
}

const levelDeleteExpectation = {
  levels: [
    {
      id: 10,
      name: 'sl0'
    }
  ]
}

describe('level reducer', () => {
  let state

  beforeEach(() => {
    state = INITIAL_STATE
    deepFreeze(state)
  })

  it('parses data from COURSE_GET_DATA', () => {
    state = levelReducer(state, {
      type: types.COURSE_GET_DATA,
      response: courseGetDataResponse
    })
    expect(state).toEqual(courseGetDataExpectation)
  })

  describe('after initializing with COURSE_GET_DATA', () => {
    beforeEach(() => {
      state = levelReducer(state, {
        type: types.COURSE_GET_DATA,
        response: courseGetDataResponse
      })
      deepFreeze(state)
    })

    it('appends a skill level with LEVEL_CREATE.', () => {
      state = levelReducer(state, {
        type: types.LEVEL_CREATE,
        response: levelCreateResponse
      })
      expect(state).toEqual(levelCreateExpectation)
    })

    it('deletes a skill level with LEVEL_DELETE.', () => {
      state = levelReducer(state, {
        type: types.LEVEL_DELETE,
        response: levelDeleteResponse
      })
      expect(state).toEqual(levelDeleteExpectation)
    })
  })
})
