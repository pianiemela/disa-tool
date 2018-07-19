import React from 'react'
import CourseHeader from '../../../containers/Course/components/header/CourseHeader'
import EditMatrixPage from '../../../containers/EditMatrix/EditMatrixPage'
import EditTasksPage from '../../../containers/EditTasks/EditTasksPage'
import EditTypesPage from '../../../containers/EditTypes/EditTypesPage'
import Navbar from '../../../containers/Course/components/navbar/Navbar'
import { CoursePage } from '../../../containers/Course/CoursePage'

const mockFn = () => {}

describe('Course page', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<CoursePage
      match={{
        url: '/course/1',
        params: {
          id: 1
        }
      }}
      location={{
        pathname: '/course/1'
      }}
      EditMatrixPage={() => <EditMatrixPage courseId={1} />}
      EditTasksPage={() => <EditTasksPage courseId={1} />}
      EditTypesPage={() => <EditTypesPage courseId={1} />}
      courseId={1}
      loading={false}
      getCourseData={mockFn}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.CoursePage').exists()).toEqual(true)
  })

  it('renders a Navbar Component', () => {
    expect(wrapper.find(Navbar).exists()).toEqual(true)
  })

  describe('while loading', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        loading: true
      })
    })

    it('does not render', () => {
      expect(wrapper.find('.CoursePage').exists()).toEqual(false)
    })
  })
})
