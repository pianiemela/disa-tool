import React from 'react'
import EditMatrixTab from '../../../../../containers/Course/components/matrix/EditMatrixTab'
import Matrix from '../../../../../containers/Course/components/matrix/Matrix'

describe('EditMatrixTab component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<EditMatrixTab
      courseId={1}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.EditMatrixTab').exists()).toEqual(true)
  })

  it('renders a Matrix component.', () => {
    expect(wrapper.find(Matrix).exists()).toEqual(true)
  })
})
