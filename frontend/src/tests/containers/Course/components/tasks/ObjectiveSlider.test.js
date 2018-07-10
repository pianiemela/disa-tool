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
})
