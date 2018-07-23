import React from 'react'
import { TaskType } from '../../../../../containers/EditTasks/components/tasks/TaskType'
import DeleteForm from '../../../../../utils/components/DeleteForm'

import { findText } from '../../../../testUtils'

const task = {
  id: 1,
  name: 'Tehtävä 1. (Tee voltti)'
}
const type = {
  id: 1,
  name: 'Viikko 1'
}

describe('TaskType component', () => {
  let wrapper
  let removeTypeFromTask

  beforeEach(() => {
    removeTypeFromTask = jest.fn()
    wrapper = shallow(<TaskType
      task={task}
      type={type}
      editing={false}
      removeTypeFromTask={removeTypeFromTask}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.TaskType').exists()).toEqual(true)
  })

  it('renders type name.', () => {
    expect(findText(type.name, wrapper)).toBeGreaterThan(0)
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

    describe('DeleteForm component', () => {
      let deleteForm
      beforeEach(() => {
        deleteForm = wrapper.find(DeleteForm)
      })

      it('includes type and task names in prompt.', () => {
        const prompt = deleteForm.prop('prompt')
        expect(prompt.filter(segment => segment.includes(type.name)).length).toBeGreaterThan(0)
        expect(prompt.filter(segment => segment.includes(task.name)).length).toBeGreaterThan(0)
      })

      it('gets the removeTypeFromTask prop as part of onExecute.', () => {
        deleteForm.prop('onExecute')()
        expect(removeTypeFromTask).toHaveBeenCalled()
      })
    })
  })
})
