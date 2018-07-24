import React from 'react'
import EditTasksTab from '../../../../../containers/Course/components/tasks/EditTasksTab'
import Matrix from '../../../../../containers/Course/components/matrix/Matrix'
import Tasklist from '../../../../../containers/Course/components/tasks/Tasklist'

describe('EditTasksTab component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<EditTasksTab
      courseId={1}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.EditTasksTab').exists()).toEqual(true)
  })

  it('renders a Matrix component.', () => {
    expect(wrapper.find(Matrix).exists()).toEqual(true)
  })

  it('renders a Tasklist component.', () => {
    expect(wrapper.find(Tasklist).exists()).toEqual(true)
  })
})
