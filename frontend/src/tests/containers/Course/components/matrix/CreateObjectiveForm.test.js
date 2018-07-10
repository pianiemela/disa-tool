import React from 'react'
import { CreateObjectiveForm } from '../../../../../containers/Course/components/matrix/CreateObjectiveForm'

const category = {
  id: 3,
  name: 'Test Category'
}
const level = {
  id: 5,
  name: 'Test Level'
}

describe('CreateObjectiveForm component', () => {
  let wrapper
  let addObjective

  beforeEach(() => {
    addObjective = jest.fn()
    wrapper = shallow(<CreateObjectiveForm
      addObjective={addObjective}
      category={category}
      level={level}
      courseId={1}
    />)
    console.log(wrapper)
  })

  it('renders.', () => {
    expect(wrapper.find('.CreateObjectiveForm').exists()).toEqual(true)
  })
})
