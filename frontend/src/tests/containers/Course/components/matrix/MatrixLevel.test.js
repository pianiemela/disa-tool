import React from 'react'
import MatrixLevel from '../../../../../containers/Course/components/matrix/MatrixLevel'

const level = {
  id: 1,
  name: 'Test Level',
  objectives: []
}

describe('MatrixLevel component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MatrixLevel
      category={{}}
      level={level}
      courseId={1}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MatrixLevel').exists()).toEqual(true)
  })
})
