import React from 'react'
import { TaskType } from '../../../../../containers/EditTasks/components/tasks/TaskType'
import DeleteForm from '../../../../../utils/components/DeleteForm'

const task = {
  id: 1,
  name: 'Tehtävä 1. (Tee voltti)'
}
const type = {
  id: 1,
  name: 'Viikko 1'
}
const mockFn = () => {}

describe('TaskType component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TaskType
      task={task}
      type={type}
      editing={false}
      removeTypeFromTask={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.TaskType').exists()).toEqual(true)
  })

  describe('when not editing', () => {
    it('does not render a DeleteForm component.', () => {
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

    it('renders a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(true)
    })
  })
})
