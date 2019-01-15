import deepFreeze from 'deep-freeze'
import categoryReducer from '../../redux/category'
import * as types from '../../redux/action_types'

const INITIAL_STATE = {
  categories: []
}

const courseGetDataResponse = {
  message: 'test message',
  data: {
    categories: [
      {
        id: 3,
        name: 'c0',
        skill_levels: [
          {
            id: 10,
            objectives: [
              {
                id: 100,
                name: 'o0'
              },
              {
                id: 101,
                name: 'o1'
              }
            ]
          },
          {
            id: 11,
            objectives: [
              {
                id: 102,
                name: 'o2'
              },
              {
                id: 103,
                name: 'o3'
              }
            ]
          }
        ]
      },
      {
        id: 4,
        name: 'c1',
        skill_levels: [
          {
            id: 10,
            objectives: [
              {
                id: 104,
                name: 'o4'
              },
              {
                id: 105,
                name: 'o5'
              }
            ]
          },
          {
            id: 11,
            objectives: [
              {
                id: 106,
                name: 'o6'
              },
              {
                id: 107,
                name: 'o7'
              }
            ]
          }
        ]
      }
    ]
  }
}

const objectiveCreateResponse = {
  message: 'test message',
  created: {
    id: 200,
    name: 'o100',
    category_id: 4,
    skill_level_id: 10
  }
}

const objectiveCreateExpectation = {
  categories: [
    {
      id: 3,
      name: 'c0',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 100,
              name: 'o0'
            },
            {
              id: 101,
              name: 'o1'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 102,
              name: 'o2'
            },
            {
              id: 103,
              name: 'o3'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'c1',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 104,
              name: 'o4'
            },
            {
              id: 105,
              name: 'o5'
            },
            {
              id: 200,
              name: 'o100'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 106,
              name: 'o6'
            },
            {
              id: 107,
              name: 'o7'
            }
          ]
        }
      ]
    }
  ]
}

const objectiveDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 103,
    category_id: 3,
    skill_level_id: 11
  }
}

const objectiveDeleteExpectation = {
  categories: [
    {
      id: 3,
      name: 'c0',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 100,
              name: 'o0'
            },
            {
              id: 101,
              name: 'o1'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 102,
              name: 'o2'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'c1',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 104,
              name: 'o4'
            },
            {
              id: 105,
              name: 'o5'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 106,
              name: 'o6'
            },
            {
              id: 107,
              name: 'o7'
            }
          ]
        }
      ]
    }
  ]
}

const categoryCreateResponse = {
  message: 'test message',
  created: {
    id: 7,
    name: 'c2',
    skill_levels: [
      {
        id: 10,
        objectives: []
      },
      {
        id: 11,
        objectives: []
      }
    ]
  }
}

const categoryCreateExpectation = {
  categories: [
    {
      id: 3,
      name: 'c0',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 100,
              name: 'o0'
            },
            {
              id: 101,
              name: 'o1'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 102,
              name: 'o2'
            },
            {
              id: 103,
              name: 'o3'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'c1',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 104,
              name: 'o4'
            },
            {
              id: 105,
              name: 'o5'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 106,
              name: 'o6'
            },
            {
              id: 107,
              name: 'o7'
            }
          ]
        }
      ]
    },
    {
      id: 7,
      name: 'c2',
      skill_levels: [
        {
          id: 10,
          objectives: []
        },
        {
          id: 11,
          objectives: []
        }
      ]
    }
  ]
}

const categoryDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 3
  }
}

const categoryDeleteExpectation = {
  categories: [
    {
      id: 4,
      name: 'c1',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 104,
              name: 'o4'
            },
            {
              id: 105,
              name: 'o5'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 106,
              name: 'o6'
            },
            {
              id: 107,
              name: 'o7'
            }
          ]
        }
      ]
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
  categories: [
    {
      id: 3,
      name: 'c0',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 100,
              name: 'o0'
            },
            {
              id: 101,
              name: 'o1'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 102,
              name: 'o2'
            },
            {
              id: 103,
              name: 'o3'
            }
          ]
        },
        {
          id: 20,
          objectives: []
        }
      ]
    },
    {
      id: 4,
      name: 'c1',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 104,
              name: 'o4'
            },
            {
              id: 105,
              name: 'o5'
            }
          ]
        },
        {
          id: 11,
          objectives: [
            {
              id: 106,
              name: 'o6'
            },
            {
              id: 107,
              name: 'o7'
            }
          ]
        },
        {
          id: 20,
          objectives: []
        }
      ]
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
  categories: [
    {
      id: 3,
      name: 'c0',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 100,
              name: 'o0'
            },
            {
              id: 101,
              name: 'o1'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'c1',
      skill_levels: [
        {
          id: 10,
          objectives: [
            {
              id: 104,
              name: 'o4'
            },
            {
              id: 105,
              name: 'o5'
            }
          ]
        }
      ]
    }
  ]
}

describe('category reducer', () => {
  let state

  beforeEach(() => {
    state = INITIAL_STATE
    deepFreeze(state)
  })

  it('parses data from COURSE_GET_DATA.', () => {
    state = categoryReducer(state, {
      type: types.COURSE_GET_DATA,
      response: courseGetDataResponse
    })
    expect(state).toEqual({
      categories: courseGetDataResponse.data.categories
    })
  })

  describe('after initializing with COURSE_GET_DATA', () => {
    beforeEach(() => {
      state = categoryReducer(state, {
        type: types.COURSE_GET_DATA,
        response: courseGetDataResponse
      })
      deepFreeze(state)
    })

    it('appends an objective with OBJECTIVE_CREATE.', () => {
      state = categoryReducer(state, {
        type: types.OBJECTIVE_CREATE,
        response: objectiveCreateResponse
      })
      expect(state).toEqual(objectiveCreateExpectation)
    })

    it('deletes an objective with OBJECTIVE_DELETE.', () => {
      state = categoryReducer(state, {
        type: types.OBJECTIVE_DELETE,
        response: objectiveDeleteResponse
      })
      expect(state).toEqual(objectiveDeleteExpectation)
    })

    it('appends a category with CATEGORY_CREATE.', () => {
      state = categoryReducer(state, {
        type: types.CATEGORY_CREATE,
        response: categoryCreateResponse
      })
      expect(state).toEqual(categoryCreateExpectation)
    })

    it('deletes a category with CATEGORY_DELETE.', () => {
      state = categoryReducer(state, {
        type: types.CATEGORY_DELETE,
        response: categoryDeleteResponse
      })
      expect(state).toEqual(categoryDeleteExpectation)
    })

    it('appends a skill level with LEVEL_CREATE.', () => {
      state = categoryReducer(state, {
        type: types.LEVEL_CREATE,
        response: levelCreateResponse
      })
      expect(state).toEqual(levelCreateExpectation)
    })

    it('deletes a skill level with LEVEL_DELETE.', () => {
      state = categoryReducer(state, {
        type: types.LEVEL_DELETE,
        response: levelDeleteResponse
      })
      expect(state).toEqual(levelDeleteExpectation)
    })
  })
})
