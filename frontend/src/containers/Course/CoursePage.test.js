import React from 'react'
import { CoursePage } from './CoursePage'

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
})
