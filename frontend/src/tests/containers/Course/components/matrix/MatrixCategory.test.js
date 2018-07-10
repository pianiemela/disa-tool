import React from 'react'
import { MatrixCategory } from '../../../../../containers/Course/components/matrix/MatrixCategory'
import MatrixLevel from '../../../../../containers/Course/components/matrix/MatrixLevel'

const category = {
  id: 1,
  name: 'Test Category',
  skill_levels: [
    {
      id: 1,
      objectives: []
    },
    {
      id: 2,
      objectives: []
    },
    {
      id: 3,
      objectives: []
    }
  ]
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

  it('renders a MatrixLevel component for each skill level.', () => {
    expect(wrapper.find(MatrixLevel).length).toEqual(category.skill_levels.length)
  })
})
