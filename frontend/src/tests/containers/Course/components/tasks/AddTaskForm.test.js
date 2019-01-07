import React from 'react'
import { AddTaskForm } from '../../../../../containers/Course/components/tasks/AddTaskForm'
import ModalForm from '../../../../../utils/components/ModalForm'

const mockFn = () => {}

describe('AddTaskForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AddTaskForm
      addTask={mockFn}
      courseId={1}
      translate={() => ''}
      newOrder={1}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.AddTaskForm').exists()).toEqual(true)
  })

  describe('ModalForm onSubmit', () => {
    it('is a function.', () => {
      expect(typeof wrapper.find(ModalForm).props().onSubmit).toEqual('function')
    })
  })
})
