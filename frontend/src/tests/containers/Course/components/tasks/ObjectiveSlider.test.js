import React from 'react'
import { ObjectiveSlider } from '../../../../../containers/Course/components/tasks/ObjectiveSlider'

const objective = {
  id: 1,
  name: 'Test Objective',
  multiplier: 0.5
}

describe('ObjectiveSlider component', () => {
  let wrapper
  let changeTaskObjectiveMultiplier

  beforeEach(() => {
    changeTaskObjectiveMultiplier = jest.fn()
    wrapper = shallow(<ObjectiveSlider
      taskId={1}
      objective={objective}
      changeTaskObjectiveMultiplier={changeTaskObjectiveMultiplier}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.ObjectiveSlider').exists()).toEqual(true)
  })

  it('renders a number input with the correct value.', () => {
    expect(wrapper.find('.numberInput').props().value).toEqual(objective.multiplier)
  })

  it('renders a range input with the correct value.', () => {
    expect(wrapper.find('.rangeInput').props().value).toEqual(objective.multiplier)
  })
})
