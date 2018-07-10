import React from 'react'
import MatrixLevel from '../../../../../containers/Course/components/matrix/MatrixLevel'
import MatrixObjective from '../../../../../containers/Course/components/matrix/MatrixObjective'

const level = {
  id: 1,
  name: 'Test Level',
  objectives: [
    {
      id: 1,
      name: '1'
    },
    {
      id: 2,
      name: '2'
    },
    {
      id: 3,
      name: '3'
    }
  ]
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

  it('renders a MatrixObjective component for each objective.', () => {
    expect(wrapper.find(MatrixObjective).length).toEqual(level.objectives.length)
  })
})
