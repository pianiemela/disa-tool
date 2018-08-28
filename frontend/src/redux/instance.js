export const instanceReducer = (state = { tasks: [], self_assessments: [] }, action) => {
  switch (action.type) {
    case 'COURSES_GET_INSTANCE_DATA_SUCCESS':
      return action.payload
    case 'ASSESMENT_RESPONSE_CREATE_SUCCESS': {
      const { data } = action.payload
      const oldAssesments = [...state.self_assessments]
      const toReplace = oldAssesments.find(oA => oA.id === data.self_assessment_id)
      toReplace.assessment_responses = [...toReplace.assessment_responses, data]
      const newAssessments = oldAssesments
        .map(oA => (oA.id === data.self_assessment_id ? toReplace : oA))
      return { ...state, self_assessments: newAssessments }
    }
    case 'CREATE_SELF_ASSESMENT_SUCCESS': {
      let { data } = action.payload
      data = { ...data, assessment_responses: [] }
      return { ...state, self_assessments: [...state.self_assessments, data] }
    }
    case 'SELF_ASSESSMENT_TOGGLE_SUCCESS': {
      const { assessment } = action.payload
      const selfAssessments = [...state.self_assessments]
      const oldAssessment = selfAssessments.find(old => old.id === assessment.id)
      oldAssessment.open = assessment.open
      oldAssessment.active = assessment.active
      oldAssessment.show_feedback = assessment.show_feedback
      return { ...state, self_assessments: selfAssessments }
    }
    case 'COURSES_GET_INSTANCE_DATA_FAILURE':
      return state
    case 'COURSE_INSTANCE_TOGGLE_ACTIVITY_SUCCESS':
      return { ...state, active: action.payload.active }
    case 'COURSE_INSTANCE_TOGGLE_ACTIVITY_FAILURE':
      return state
    case 'COURSE_INSTANCE_UPDATE_PERSON_ROLE_SUCCESS': {
      const updatePeople = [...state.people]
      updatePeople.forEach((person) => {
        const update = action.payload.updatedPersons.find(cp => cp.person_id === person.id)
        if (update) {
          person.course_instances[0].course_person.role = update.role
        }
      })
      return { ...state, people: updatePeople }
    }
    case 'COURSE_INSTANCE_POST_TASK_RESPONSES_SUCCESS': {
      const people = [...state.people]
      const updatedTasks = action.payload.createdResponses
      updatedTasks.forEach((task) => {
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

