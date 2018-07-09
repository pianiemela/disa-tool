import React from 'react'
import { CourseHeader } from '../../../../../containers/Course/components/header/CourseHeader'

const mockFn = () => {}
const createWrapper = () => shallow(<CourseHeader
  courseName="Test Course"
  editing={false}
  setEditing={mockFn}
/>)

describe('CourseHeader component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('renders', () => {
    expect(wrapper.find('.CourseHeader').exists()).toEqual(true)
  })
})
