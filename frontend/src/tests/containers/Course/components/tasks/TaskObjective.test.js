import React from 'react'
import TaskObjective from '../../../../../containers/Course/components/tasks/TaskObjective'
import ObjectiveSlider from '../../../../../containers/Course/components/tasks/ObjectiveSlider'
import DetachObjectiveForm from '../../../../../containers/Course/components/tasks/DetachObjectiveForm'

const task = {
  id: 1,
  name: 'Tehtävä 1'
}
const objective = {
  id: 3,
  name: 'Test Objective'
}

describe('TaskObjective component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TaskObjective
      task={task}
      objective={objective}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.TaskObjective').exists()).toEqual(true)
  })
})
