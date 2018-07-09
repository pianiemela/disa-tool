import React from 'react'
import { CourseHeader } from '../../../../../containers/Course/components/header/CourseHeader'

const mockFn = () => {}
const courseName = 'Test Course'
const createWrapper = () => shallow(<CourseHeader
  courseName={courseName}
  editing={false}
  setEditing={mockFn}
/>)

const findText = (text, wrapper) => {
  let found = 0
  if (wrapper.text().includes(text)) found += 1
  wrapper.children().forEach((child) => {
    found += findText(text, child)
  })
  return found
}

describe('CourseHeader component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('renders', () => {
    expect(wrapper.find('.CourseHeader').exists()).toEqual(true)
  })

  it('renders course name', () => {
    expect(findText(courseName, wrapper.find('.headerBlock'))).toEqual(1)
  })
})
