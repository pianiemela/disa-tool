import React from 'react'
import Navbar from '../../../containers/Course/components/navbar/Navbar'
import { CoursePage } from '../../../containers/Course/CoursePage'
import CourseHeader from '../../../containers/Course/components/header/CourseHeader'

const mockFn = () => {}

describe('Course page', () => {
  let wrapper
  let getCourseData

  beforeEach(() => {
    getCourseData = jest.fn()
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
      EditMatrixTab={mockFn}
      EditTasksTab={mockFn}
      EditTypesTab={mockFn}
      courseId={1}
      loading={false}
      getCourseData={getCourseData}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.CoursePage').exists()).toEqual(true)
  })

  it('renders a Navbar Component', () => {
    expect(wrapper.find(Navbar).exists()).toEqual(true)
  })

  it('renders a CourseHeader Component', () => {
    expect(wrapper.find(CourseHeader).exists()).toEqual(true)
  })

  it('calls the getCourseData prop with the correct course id.', () => {
    expect(getCourseData).toHaveBeenCalledWith({
      id: 1
    })
  })

  describe('while loading', () => {
    beforeEach(() => {
      wrapper.setProps({
        loading: true
      })
    })

    it('does not render', () => {
      expect(wrapper.find('.CoursePage').exists()).toEqual(false)
    })
  })
})
