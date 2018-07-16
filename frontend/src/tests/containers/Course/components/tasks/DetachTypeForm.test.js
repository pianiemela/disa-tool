import React from 'react'
import { DetachTypeForm } from '../../../../../containers/Course/components/tasks/DetachTypeForm'
import ModalForm from '../../../../../utils/components/ModalForm'
import { findText } from '../../../../testUtils'

const type = {
  id: 1,
  name: 'Test Type'
}
const task = {
  id: 7,
  name: 'Test Task'
}
const mockFn = () => {}
describe('DetachTypeForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DetachTypeForm
      type={type}
      task={task}
      removeTypeFromTask={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.DetachTypeForm').exists()).toEqual(true)
  })

  describe('form content', () => {
    let content

    beforeEach(() => {
      content = shallow(wrapper.find(ModalForm).props().content)
    })

    it('renders type name.', () => {
      expect(findText(type.name, content)).toBeGreaterThan(0)
    })

    it('renders task name', () => {
      expect(findText(task.name, content)).toBeGreaterThan(0)
    })
  })
})
