import React from 'react'
import { DetachObjectiveForm } from '../../../../../containers/Course/components/tasks/DetachObjectiveForm'
import ModalForm from '../../../../../utils/components/ModalForm'
import { findText } from '../../../../testUtils'

const objective = {
  id: 1,
  name: 'Test Objective'
}
const task = {
  id: 7,
  name: 'Test Task'
}
const mockFn = () => {}
describe('DetachObjectiveForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DetachObjectiveForm
      objective={objective}
      task={task}
      removeObjectiveFromTask={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.DetachObjectiveForm').exists()).toEqual(true)
  })

  describe('form content', () => {
    let content

    beforeEach(() => {
      content = shallow(wrapper.find(ModalForm).props().content)
    })

    it('renders objective name.', () => {
      expect(findText(objective.name, content)).toBeGreaterThan(0)
    })

    it('renders task name', () => {
      expect(findText(task.name, content)).toBeGreaterThan(0)
    })
  })
})
