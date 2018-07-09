import React from 'react'
import { CourseHeader } from '../../../../../containers/Course/components/header/CourseHeader'
import { findText } from '../../../../testUtils'

const mockFn = () => {}
const courseName = 'Test Course'
const createWrapper = () => shallow(<CourseHeader
  courseName={courseName}
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

  it('renders course name', () => {
    expect(findText(courseName, wrapper.find('.headerBlock'))).toEqual(1)
  })
})
