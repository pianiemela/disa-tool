import deepFreeze from 'deep-freeze'
import typeReducer from '../../redux/type'

const INITIAL_STATE = {
  headers: []
}

const courseGetDataResponse = {
  message: 'test message',
  data: {
    type_headers: [
      {
        id: 2,
        name: 'th1',
        types: [
          {
            id: 10,
            name: 't0',
            multiplier: 1
          },
          {
            id: 11,
            name: 't1',
            multiplier: 0.9
          }
        ]
      },
      {
        id: 1,
        name: 'th0',
        types: [
          {
            id: 12,
            name: 't2',
            multiplier: 0.8
          },
          {
            id: 13,
            name: 't3',
            multiplier: 0.7
          }
        ]
      }
    ]
  }
}

const courseGetDataExpectation = {
  headers: [
    {
      id: 2,
      name: 'th1',
      types: [
        {
          id: 10,
          name: 't0',
          multiplier: 1
        },
        {
          id: 11,
          name: 't1',
          multiplier: 0.9
        }
      ]
    },
    {
      id: 1,
      name: 'th0',
      types: [
        {
          id: 12,
          name: 't2',
          multiplier: 0.8
        },
        {
          id: 13,
          name: 't3',
          multiplier: 0.7
        }
      ]
    }
  ]
}

const typeDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 11,
    type_header_id: 2
  }
}

const typeDeleteExpectation = {
  headers: [
    {
      id: 2,
      name: 'th1',
      types: [
        {
          id: 10,
          name: 't0',
          multiplier: 1
        }
      ]
    },
    {
      id: 1,
      name: 'th0',
      types: [
        {
          id: 12,
          name: 't2',
          multiplier: 0.8
        },
        {
          id: 13,
          name: 't3',
          multiplier: 0.7
        }
      ]
    }
  ]
}

const typeCreateResponse = {
  message: 'test message',
  created: {
    id: 20,
    name: 't10',
    multiplier: 1,
    type_header_id: 1
  }
}

const typeCreateExpectation = {
  headers: [
    {
      id: 2,
      name: 'th1',
      types: [
        {
          id: 10,
          name: 't0',
          multiplier: 1
        },
        {
          id: 11,
          name: 't1',
          multiplier: 0.9
        }
      ]
    },
    {
      id: 1,
      name: 'th0',
      types: [
        {
          id: 12,
          name: 't2',
          multiplier: 0.8
        },
        {
          id: 13,
          name: 't3',
          multiplier: 0.7
        },
        {
          id: 20,
          name: 't10',
          multiplier: 1
        }
      ]
    }
  ]
}

const typeHeaderDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 2
  }
}

const typeHeaderDeleteExpectation = {
  headers: [
    {
      id: 1,
      name: 'th0',
      types: [
        {
          id: 12,
          name: 't2',
          multiplier: 0.8
        },
        {
          id: 13,
          name: 't3',
          multiplier: 0.7
        }
      ]
    }
  ]
}

const typeHeaderCreateResponse = {
  message: 'test message',
  created: {
    id: 8,
    name: 'th2',
    types: []
  }
}

const typeHeaderCreateExpectation = {
  headers: [
    {
      id: 2,
      name: 'th1',
      types: [
        {
          id: 10,
          name: 't0',
          multiplier: 1
        },
        {
          id: 11,
          name: 't1',
          multiplier: 0.9
        }
      ]
    },
    {
      id: 1,
      name: 'th0',
      types: [
        {
          id: 12,
          name: 't2',
          multiplier: 0.8
        },
        {
          id: 13,
          name: 't3',
          multiplier: 0.7
        }
      ]
    },
    {
      id: 8,
      name: 'th2',
      types: []
    }
  ]
}

describe('type reducer', () => {
  let state

  beforeEach(() => {
    state = INITIAL_STATE
    deepFreeze(state)
  })

  it('parses data from COURSE_GET_DATA', () => {
    state = typeReducer(state, {
      type: 'COURSE_GET_DATA',
      response: courseGetDataResponse
    })
    expect(state).toEqual(courseGetDataExpectation)
  })

  describe('after initializing with COURSE_GET_DATA', () => {
    beforeEach(() => {
      state = typeReducer(state, {
        type: 'COURSE_GET_DATA',
        response: courseGetDataResponse
      })
      deepFreeze(state)
    })

    it('deletes a type with TYPE_DELETE.', () => {
      state = typeReducer(state, {
        type: 'TYPE_DELETE',
        response: typeDeleteResponse
      })
      expect(state).toEqual(typeDeleteExpectation)
    })

    it('appends a type with TYPE_CREATE.', () => {
      state = typeReducer(state, {
        type: 'TYPE_CREATE',
        response: typeCreateResponse
      })
      expect(state).toEqual(typeCreateExpectation)
    })

    it('deletes a type header with TYPE_HEADER_DELETE.', () => {
      state = typeReducer(state, {
        type: 'TYPE_HEADER_DELETE',
        response: typeHeaderDeleteResponse
      })
      expect(state).toEqual(typeHeaderDeleteExpectation)
    })

    it('appends a type header with TYPE_HEADER_CREATE.', () => {
      state = typeReducer(state, {
        type: 'TYPE_HEADER_CREATE',
        response: typeHeaderCreateResponse
      })
      expect(state).toEqual(typeHeaderCreateExpectation)
    })
  })
})
