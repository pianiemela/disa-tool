import deepFreeze from 'deep-freeze'
import taskReducer from '../../redux/task'

const INITIAL_STATE = {
  tasks: [],
  active: null,
  lastMultiplierUpdate: null
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
  lastMultiplierUpdate: null,
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
  lastMultiplierUpdate: null,
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
  lastMultiplierUpdate: null,
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
  lastMultiplierUpdate: expect.any(Date),
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

const taskDetachObjectiveResponse = {
  message: 'test message',
  deleted: {
    task_id: 6,
    objective_id: 12
  }
}

const taskDetachObjectiveExpectation = {
  lastMultiplierUpdate: expect.any(Date),
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

const taskAttachTypeResponse = {
  message: 'test message',
  created: {
    task_id: 6,
    type_id: 200
  },
  taskObjectives: []
}

const taskAttachTypeExpectation = {
  lastMultiplierUpdate: expect.any(Date),
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
        102,
        200
      ]
    }
  ],
  active: null
}

const taskDetachTypeResponse = {
  message: 'test message',
  deleted: {
    task_id: 6,
    type_id: 100
  },
  taskObjectives: []
}

const taskDetachTypeExpectation = {
  lastMultiplierUpdate: expect.any(Date),
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
        102
      ]
    }
  ],
  active: null
}

const objectiveDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 11,
    task_ids: [5, 6]
  }
}

const objectiveDeleteExpectation = {
  lastMultiplierUpdate: null,
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

const typeDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 100,
    task_ids: [5, 6]
  }
}

const typeDeleteExpectation = {
  lastMultiplierUpdate: null,
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
        102
      ]
    }
  ],
  active: null
}

const categoryDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 4,
    tasks: [
      {
        id: 5,
        objective_ids: [10, 11]
      },
      {
        id: 6,
        objective_ids: [11]
      }
    ]
  }
}

const categoryDeleteExpectation = {
  lastMultiplierUpdate: null,
  tasks: [
    {
      id: 5,
      name: 't0',
      description: 'td0',
      info: 'ti0',
      objectives: [],
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

const levelDeleteResponse = {
  message: 'test message',
  deleted: {
    id: 4,
    tasks: [
      {
        id: 5,
        objective_ids: [11]
      },
      {
        id: 6,
        objective_ids: [11, 12]
      }
    ]
  }
}

const levelDeleteExpectation = {
  lastMultiplierUpdate: null,
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
      objectives: [],
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

    it('deletes an objective with TASK_DETACH_OBJECTIVE.', () => {
      state = taskReducer(state, {
        type: 'TASK_DETACH_OBJECTIVE',
        response: taskDetachObjectiveResponse
      })
      expect(state).toEqual(taskDetachObjectiveExpectation)
    })

    it('appends a type id with TASK_ATTACH_TYPE.', () => {
      state = taskReducer(state, {
        type: 'TASK_ATTACH_TYPE',
        response: taskAttachTypeResponse
      })
      expect(state).toEqual(taskAttachTypeExpectation)
    })

    it('deletes a type id with TASK_DETACH_TYPE.', () => {
      state = taskReducer(state, {
        type: 'TASK_DETACH_TYPE',
        response: taskDetachTypeResponse
      })
      expect(state).toEqual(taskDetachTypeExpectation)
    })

    it('deletes objective from all tasks with OBJECTIVE_DELETE.', () => {
      state = taskReducer(state, {
        type: 'OBJECTIVE_DELETE',
        response: objectiveDeleteResponse
      })
      expect(state).toEqual(objectiveDeleteExpectation)
    })

    it('deletes type from all tasks with TYPE_DELETE.', () => {
      state = taskReducer(state, {
        type: 'TYPE_DELETE',
        response: typeDeleteResponse
      })
      expect(state).toEqual(typeDeleteExpectation)
    })

    it('deletes all deleted objectives with CATEGORY_DELETE.', () => {
      state = taskReducer(state, {
        type: 'CATEGORY_DELETE',
        response: categoryDeleteResponse
      })
      expect(state).toEqual(categoryDeleteExpectation)
    })

    it('deletes all deleted objectives with LEVEL_DELETE.', () => {
      state = taskReducer(state, {
        type: 'LEVEL_DELETE',
        response: levelDeleteResponse
      })
      expect(state).toEqual(levelDeleteExpectation)
    })
  })
})
