export const instanceReducer = (state = { tasks: [], self_assessments: [] }, action) => {
  switch (action.type) {
    case 'COURSES_GET_INSTANCE_DATA_SUCCESS':
      return action.payload
    case 'COURSES_GET_INSTANCE_DATA_FAILURE':
      return state
    case 'COURSE_INSTANCE_TOGGLE_ACTIVITY_SUCCESS':
      return { ...state, active: action.payload.active }
    case 'COURSE_INSTANCE_TOGGLE_ACTIVITY_FAILURE':
      return state
    case 'COURSE_INSTANCE_UPDATE_PERSON_ROLE_SUCCESS': {
      const updatePeople = [...state.people]
      updatePeople.map((person) => {
        const update = action.payload.find(cp => cp.person_id === person.id)
        if (update) {
          person.course_instances[0].course_person.role = update.role
        }
      })
      return { ...state, people: updatePeople }
    }
    case 'COURSE_INSTANCE_POST_TASK_RESPONSES_SUCCESS': {
      const people = [...state.people]
      const updatedTasks = action.payload.createdResponses
      updatedTasks.map((task) => {
        const student = people.find(p => p.id === task.person_id)
        if (student) {
          const oldTask = student.task_responses.find(t => t.id === task.id)
          if (oldTask) {
            oldTask.points = task.points
          } else {
            student.task_responses.push(task)
          }
        }
      })
      return { ...state, people }
    }
    default:
      return state
  }
}

export default instanceReducer

