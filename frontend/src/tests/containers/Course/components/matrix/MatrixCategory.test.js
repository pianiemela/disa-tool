import React from 'react'
import { MatrixCategory } from '../../../../../containers/Course/components/matrix/MatrixCategory'

const category = {
  id: 1,
  name: 'Test Category',
  skill_levels: []
}

describe('MatrixCategory component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MatrixCategory
      category={category}
      courseId={1}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MatrixCategory').exists()).toEqual(true)
  })
})
