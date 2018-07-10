import React from 'react'
import MatrixObjective from '../../../../../containers/Course/components/matrix/MatrixObjective'

const objective = {
  id: 1,
  name: 'Test objective'
}

describe('MatrixObjective component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MatrixObjective
      objective={objective}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MatrixObjective').exists()).toEqual(true)
  })
})
