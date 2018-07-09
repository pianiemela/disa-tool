import React from 'react'
import { Matrix } from '../../../../../containers/Course/components/matrix/Matrix'

describe('Matrix component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Matrix
      courseId={1}
      levels={[]}
      categories={[]}
      editing={false}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.Matrix').exists()).toEqual(true)
  })
})
