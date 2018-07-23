import React from 'react'
import { TaskObjective } from '../../../../../containers/EditTasks/components/tasks/TaskObjective'
import ObjectiveSlider from '../../../../../containers/EditTasks/components/tasks/ObjectiveSlider'
import DeleteForm from '../../../../../utils/components/DeleteForm'

const task = {
  id: 1,
  name: 'Tehtävä 1'
}
const objective = {
  id: 3,
  name: 'Test Objective'
}
const mockFn = () => {}

describe('TaskObjective component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TaskObjective
      task={task}
      objective={objective}
      editing={false}
      removeObjectiveFromTask={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.TaskObjective').exists()).toEqual(true)
  })

  it('renders an ObjectiveSlider component.', () => {
    expect(wrapper.find(ObjectiveSlider).exists()).toEqual(true)
  })

  describe('when not editing', () => {
    it('does not render an DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })

    it('renders an DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(true)
    })
  })
})
