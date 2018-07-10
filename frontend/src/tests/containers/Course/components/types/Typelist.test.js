import React from 'react'
import { Typelist } from '../../../../../containers/Course/components/types/Typelist'

const types = [
  {
    id: 1,
    name: 'Test Type'
  },
  {
    id: 2,
    name: 'Testier Type'
  }
]

describe('Typelist component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Typelist
      types={types}
      courseId={1}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Typelist').exists()).toEqual(true)
  })
})
