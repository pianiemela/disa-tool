import React from 'react'
import { RemoveTaskForm } from '../../../../../containers/Course/components/tasks/RemoveTaskForm'
import ModalForm from '../../../../../utils/components/ModalForm'
import { findText } from '../../../../testUtils'

const task = {
  id: 7,
  name: 'Test Task'
}
const mockFn = () => {}

describe('RemoveTaskForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RemoveTaskForm
      task={task}
      removeTask={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.RemoveTaskForm').exists()).toEqual(true)
  })

  describe('form content', () => {
    let content

    beforeEach(() => {
      content = shallow(wrapper.find(ModalForm).props().content)
    })

    it('renders task name', () => {
      expect(findText(task.name, content)).toBeGreaterThan(0)
    })
  })
})
