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

  it('renders an ObjectiveSlider component.', () => {
    expect(wrapper.find(ObjectiveSlider).exists()).toEqual(true)
  })

  describe('when not editing', () => {
    it('does not render an DetachObjectiveForm component.', () => {
      expect(wrapper.find(DetachObjectiveForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })

    it('renders an DetachObjectiveForm component.', () => {
      expect(wrapper.find(DetachObjectiveForm).exists()).toEqual(true)
    })
  })
})
