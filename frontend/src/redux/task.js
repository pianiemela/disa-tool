import * as types from './action_types'

const INITIAL_STATE = {
  tasks: [],
  active: null,
  lastMultiplierUpdate: null
}

const detachObjectiveFromMany = (state, action) => {
  const deleteFrom = []
  action.response.deleted.task_ids.forEach((taskId) => {
    deleteFrom[taskId] = true
  })
  return {
    ...state,
    tasks: state.tasks.map((task) => {
      if (deleteFrom[task.id]) {
        return {
          ...task,
          objectives: task.objectives
            .filter(objective => objective.id !== action.response.deleted.id)
        }
      }
      return task
    })
  }
}

const detachTypeFromMany = (state, action) => {
  const deleteFrom = []
  action.response.deleted.task_ids.forEach((taskId) => {
    deleteFrom[taskId] = true
  })
  return {
    ...state,
    tasks: state.tasks.map((task) => {
      if (deleteFrom[task.id]) {
        return {
          ...task,
          types: task.types.filter(type => type !== action.response.deleted.id)
        }
      }
      return task
    })
  }
}

const detachManyObjectives = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    const deletionTask = action.response.deleted.tasks.find(delTask => delTask.id === task.id)
    if (!deletionTask) {
      return task
    }
    const toDelete = {}
    deletionTask.objective_ids.forEach((id) => {
      toDelete[id] = true
    })
    return {
      ...task,
      objectives: task.objectives.filter(objective => !toDelete[objective.id])
    }
  })
})

const detachOneObjective = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.deleted.task_id) {
      return {
        ...task,
        objectives: task.objectives.filter(objective => (
          objective.id !== action.response.deleted.objective_id
        ))
      }
    }
    return task
  }),
  lastMultiplierUpdate: new Date()
})

const attachObjective = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.created.task_id) {
      return {
        ...task,
        objectives: [
          ...task.objectives,
          {
            id: action.response.created.objective_id,
            multiplier: action.response.created.multiplier
          }
        ]
      }
    }
    return task
  }),
  lastMultiplierUpdate: new Date()
})

const detachOneType = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.deleted.task_id) {
      return {
        ...task,
        defaultMultiplier: action.response.multiplier,
        types: task.types.filter(type => (
          type !== action.response.deleted.type_id
        )),
        objectives: [
          ...task.objectives
            .filter(objective => !action.response.taskObjectives
              .find(taskObjective => taskObjective.id === objective.id)),
          ...action.response.taskObjectives
        ]
      }
    }
    return task
  }),
  lastMultiplierUpdate: new Date()
})

const attachType = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.created.task_id) {
      return {
        ...task,
        defaultMultiplier: action.response.multiplier,
        types: [
          ...task.types,
          action.response.created.type_id
        ],
        objectives: [
          ...task.objectives
            .filter(objective => !action.response.taskObjectives
              .find(taskObjective => taskObjective.id === objective.id)),
          ...action.response.taskObjectives
        ]
      }
    }
    return task
  }),
  lastMultiplierUpdate: new Date()
})

const taskReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.COURSE_GET_DATA:
      return {
        ...state,
        tasks: action.response.data.tasks
      }
    case types.TASK_CHANGE_ACTIVE:
      return {
        ...state,
        active: state.active === action.id ? null : action.id
      }
    case types.TASK_CREATE:
      return {
        ...state,
        tasks: [...state.tasks, action.response.created]
      }
    case types.TASK_DELETE:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.response.deleted.id)
      }
    case types.TASK_ATTACH_OBJECTIVE:
      return attachObjective(state, action)
    case types.TASK_DETACH_OBJECTIVE:
      return detachOneObjective(state, action)
    case types.TASK_ATTACH_TYPE:
      return attachType(
        action.response.deleted ? detachOneType(state, action) : state,
        action
      )
    case types.TASK_DETACH_TYPE:
      return detachOneType(state, action)
    case types.OBJECTIVE_DELETE:
      return detachObjectiveFromMany(state, action, 'objectives')
    case types.TYPE_DELETE:
      return detachTypeFromMany(state, action, 'types')
    case types.CATEGORY_DELETE:
      return detachManyObjectives(state, action)
    case types.LEVEL_DELETE:
      return detachManyObjectives(state, action)
    case types.TASK_EDIT:
      return {
        ...state,
        tasks: state.tasks.map(task => (task.id === action.response.edited.id ? {
          ...task,
          ...action.response.edited,
          max_points: action.response.edited.max_points ? (
            Number(action.response.edited.max_points)
          ) : task.max_points,
          types: task.types,
          objectives: task.objectives,
          defaultMultiplier: task.defaultMultiplier
        } : task))
      }
    case types.TASK_EDIT_OBJECTIVE_MULTIPLIERS:
      return {
        ...state,
        tasks: state.tasks.map(task => (task.id === action.response.edited.task_id ? {
          ...task,
          objectives: task.objectives.map((objective) => {
            const editedObjective = action.response.edited.task_objectives
              .find(to => to.objective_id === objective.id)
            return editedObjective ? {
              ...objective,
              multiplier: editedObjective.multiplier
            } : objective
          })
        } : task)),
        lastMultiplierUpdate: new Date()
      }
    default:
      return state
  }
}

export default taskReducer
