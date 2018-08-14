import React from 'react'
import { EditTasksTab } from '../../../../../containers/Course/components/tasks/EditTasksTab'
import Matrix from '../../../../../containers/Course/components/matrix/Matrix'
import Tasklist from '../../../../../containers/Course/components/tasks/Tasklist'
import Headerlist from '../../../../../containers/Course/components/types/Headerlist'

describe('EditTasksTab component', () => {
  let wrapper
  let changeActive

  beforeEach(() => {
    changeActive = jest.fn()
    wrapper = shallow(<EditTasksTab
      courseId={1}
      changeActive={changeActive}
      tasks={[]}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.EditTasksTab').exists()).toEqual(true)
  })

  it('renders a Matrix component.', () => {
    expect(wrapper.find(Matrix).exists()).toEqual(true)
  })

  it('renders Headerlist component.', () => {
    expect(wrapper.find(Headerlist).exists()).toEqual(true)
  })

  it('renders a Tasklist component.', () => {
    expect(wrapper.find(Tasklist).exists()).toEqual(true)
  })

  it('calls changeActive on unmount.', () => {
    expect(changeActive).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(changeActive).toHaveBeenCalledWith(null)
  })
})
