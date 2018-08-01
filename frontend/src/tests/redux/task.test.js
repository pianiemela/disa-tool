import deepFreeze from 'deep-freeze'
import taskReducer from '../../redux/task'

const INITIAL_STATE = {
  tasks: [],
  active: null
}

const courseGetDataResponse = {
  message: 'test message',
  data: {
    tasks: [
      {
        id: 5,
        name: 't0',
        description: 'td0',
        info: 'ti0',
        objectives: [
          {
            id: 10,
            multiplier: 1
          },
          {
            id: 11,
            multiplier: 0.9
          }
        ],
        types: [
          100,
          101
        ]
      },
      {
        id: 6,
        name: 't1',
        description: 'td1',
        info: 'ti1',
        objectives: [
          {
            id: 11,
            multiplier: 0.8
          },
          {
            id: 12,
            multiplier: 0.7
          }
        ],
        types: [
          100,
          102
        ]
      }
    ]
  }
}

const courseGetDataExpectation = {
  tasks: [
    {
      id: 5,
      name: 't0',
      description: 'td0',
      info: 'ti0',
      objectives: [
        {
          id: 10,
          multiplier: 1
        },
        {
          id: 11,
          multiplier: 0.9
        }
      ],
      types: [
        100,
        101
      ]
    },
    {
      id: 6,
      name: 't1',
      description: 'td1',
      info: 'ti1',
      objectives: [
        {
          id: 11,
          multiplier: 0.8
        },
        {
          id: 12,
          multiplier: 0.7
        }
      ],
      types: [
        100,
        102
      ]
    }
  ],
  active: null
}

const taskCreateResponse = {
  message: 'test message',
  created: {
    id: 9,
    name: 't2',
    description: 'td2',
    info: 'ti2',
    objectives: [],
    types: []
  }
}

const taskCreateExpectation = {
  tasks: [
    {
      id: 5,
      name: 't0',
      description: 'td0',
      info: 'ti0',
      objectives: [
        {
          id: 10,
          multiplier: 1
        },
        {
          id: 11,
          multiplier: 0.9
        }
      ],
      types: [
        100,
        101
      ]
    },
    {
      id: 6,
      name: 't1',
      description: 'td1',
      info: 'ti1',
      objectives: [
        {
          id: 11,
          multiplier: 0.8
        },
        {
          id: 12,
          multiplier: 0.7
        }
      ],
      types: [
        100,
        102
      ]
    },
    {
      id: 9,
      name: 't2',
      description: 'td2',
      info: 'ti2',
      objectives: [],
      types: []
    }
  ],
  active: null
}

const taskDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 6
  }
}

const taskDeleteExpectation = {
  tasks: [
    {
      id: 5,
      name: 't0',
      description: 'td0',
      info: 'ti0',
      objectives: [
        {
          id: 10,
          multiplier: 1
        },
        {
          id: 11,
          multiplier: 0.9
        }
      ],
      types: [
        100,
        101
      ]
    }
  ],
  active: null
}

const taskAttachObjectiveResponse = {
  message: 'test message',
  created: {
    task_id: 5,
    objective_id: 100,
    multiplier: 1
  }
}

const taskAttachObjectiveExpectation = {
  tasks: [
    {
      id: 5,
      name: 't0',
      description: 'td0',
      info: 'ti0',
      objectives: [
        {
          id: 10,
          multiplier: 1
        },
        {
          id: 11,
          multiplier: 0.9
        },
        {
          id: 100,
          multiplier: 1
        }
      ],
      types: [
        100,
        101
      ]
    },
    {
      id: 6,
      name: 't1',
      description: 'td1',
      info: 'ti1',
      objectives: [
        {
          id: 11,
          multiplier: 0.8
        },
        {
          id: 12,
          multiplier: 0.7
        }
      ],
      types: [
        100,
        102
      ]
    }
  ],
  active: null
}

describe('task reducer', () => {
  let state

  beforeEach(() => {
    state = INITIAL_STATE
    deepFreeze(state)
  })

  it('parses data from COURSE_GET_DATA', () => {
    state = taskReducer(state, {
      type: 'COURSE_GET_DATA',
      response: courseGetDataResponse
    })
    expect(state).toEqual(courseGetDataExpectation)
  })

  it('changes active with CHANGE_ACTIVE.', () => {
    state = taskReducer(state, {
      type: 'TASK_CHANGE_ACTIVE',
      id: 5
    })
    expect(state.active).toEqual(5)
    state = taskReducer(state, {
      type: 'TASK_CHANGE_ACTIVE',
      id: 6
    })
    expect(state.active).toEqual(6)
    state = taskReducer(state, {
      type: 'TASK_CHANGE_ACTIVE',
      id: 6
    })
    expect(state.active).toEqual(null)
  })

  describe('after initializing with COURSE_GET_DATA', () => {
    beforeEach(() => {
      state = taskReducer(state, {
        type: 'COURSE_GET_DATA',
        response: courseGetDataResponse
      })
      deepFreeze(state)
    })

    it('appends a task with TASK_CREATE.', () => {
      state = taskReducer(state, {
        type: 'TASK_CREATE',
        response: taskCreateResponse
      })
      expect(state).toEqual(taskCreateExpectation)
    })

    it('deletes a task with TASK_DELETE.', () => {
      state = taskReducer(state, {
        type: 'TASK_DELETE',
        response: taskDeleteResponse
      })
      expect(state).toEqual(taskDeleteExpectation)
    })

    it('appends an objective with TASK_ATTACH_OBJECTIVE.', () => {
      state = taskReducer(state, {
        type: 'TASK_ATTACH_OBJECTIVE',
        response: taskAttachObjectiveResponse
      })
      expect(state).toEqual(taskAttachObjectiveExpectation)
    })
  })
})
