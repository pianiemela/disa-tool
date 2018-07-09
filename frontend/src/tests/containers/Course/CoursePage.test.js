import React from 'react'
import { CoursePage } from '../../../containers/Course/CoursePage'
import CourseHeader from '../../../containers/Course/components/header/CourseHeader'
import Matrix from '../../../containers/Course/components/matrix/Matrix'
import Tasklist from '../../../containers/Course/components/tasks/Tasklist'
import Typelist from '../../../containers/Course/components/types/Typelist'

describe('Course page', () => {
  let wrapper
  const mockFn = () => {}

  beforeEach(() => {
    wrapper = shallow(<CoursePage
      courseId={1}
      course={{}}
      editing={false}
      loading={false}
      getCourseData={mockFn}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.CoursePage').exists()).toEqual(true)
  })

  it('renders CourseHeader', () => {
    expect(wrapper.find(CourseHeader).exists()).toEqual(true)
  })

  it('renders Matrix', () => {
    expect(wrapper.find(Matrix).exists()).toEqual(true)
  })

  it('renders Tasklist', () => {
    expect(wrapper.find(Tasklist).exists()).toEqual(true)
  })

  it('renders Typelist', () => {
    expect(wrapper.find(Typelist).exists()).toEqual(true)
  })
})
