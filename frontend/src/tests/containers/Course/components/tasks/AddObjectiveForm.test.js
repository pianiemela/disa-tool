import React from 'react'
import { AddObjectiveForm } from '../../../../../containers/Course/components/tasks/AddObjectiveForm'
import ModalForm from '../../../../../utils/components/ModalForm'
import { findText } from '../../../../testUtils'

const objectiveIds = [1, 3]
const objectives = [
  {
    id: 1,
    name: '1'
  },
  {
    id: 2,
    name: '2'
  },
  {
    id: 3,
    name: '3'
  },
  {
    id: 4,
    name: '4'
  }
]
const task = {
  id: 7,
  name: 'Test Task'
}
const mockFn = () => {}

describe('AddObjectiveForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AddObjectiveForm
      addObjectiveToTask={mockFn}
      objectiveIds={objectiveIds}
      objectives={objectives}
      task={task}
      courseId={1}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.AddObjectiveForm').exists()).toEqual(true)
  })

  describe('form content', () => {
    let content

    beforeEach(() => {
      content = shallow(wrapper.find(ModalForm).props().content)
    })

    it('renders task name.', () => {
      expect(findText(task.name, content)).toBeGreaterThan(0)
    })
  })

  describe('ModalForm onSubmit', () => {
    it('is a function.', () => {
      expect(typeof wrapper.find(ModalForm).props().onSubmit).toEqual('function')
    })
  })
})
