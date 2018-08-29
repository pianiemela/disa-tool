import React from 'react'
import { CourseHeader } from '../../../../../containers/Course/components/header/CourseHeader'
import { findText } from '../../../../testUtils'

const courseName = 'Test Course'

describe('CourseHeader component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<CourseHeader
      course={{ id: 1, name: courseName }}
      translate={() => ''}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.CourseHeader').exists()).toEqual(true)
  })

  it('renders course name.', () => {
    expect(findText(courseName, wrapper)).toBeGreaterThan(0)
  })
})
