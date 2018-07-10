import React from 'react'
import { ObjectiveSlider } from '../../../../../containers/Course/components/tasks/ObjectiveSlider'

const objective = {
  id: 1,
  name: 'Test Objective',
  multiplier: 0.5
}
const taskId = 1

describe('ObjectiveSlider component', () => {
  let wrapper
  let changeTaskObjectiveMultiplier

  beforeEach(() => {
    changeTaskObjectiveMultiplier = jest.fn()
    wrapper = shallow(<ObjectiveSlider
      taskId={taskId}
      objective={objective}
      changeTaskObjectiveMultiplier={changeTaskObjectiveMultiplier}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.ObjectiveSlider').exists()).toEqual(true)
  })

  describe('number input', () => {
    let numberInput

    beforeEach(() => {
      numberInput = wrapper.find('.numberInput')
    })

    it('renders with the correct value.', () => {
      expect(numberInput.props().value).toEqual(objective.multiplier)
    })

    it('calls changeTaskObjectiveMultiplier when value is changed.', () => {
      numberInput.simulate('change', {
        target: {
          value: 0.4
        }
      })
      expect(changeTaskObjectiveMultiplier).toHaveBeenCalledWith({
        taskId,
        objectiveId: objective.id,
        multiplier: 0.4
      })
    })
  })

  describe('range input', () => {
    let rangeInput

    beforeEach(() => {
      rangeInput = wrapper.find('.rangeInput')
    })

    it('renders with the correct value.', () => {
      expect(rangeInput.props().value).toEqual(objective.multiplier)
    })

    it('calls changeTaskObjectiveMultiplier when value is changed.', () => {
      rangeInput.simulate('change', {
        target: {
          value: 0.4
        }
      })
      expect(changeTaskObjectiveMultiplier).toHaveBeenCalledWith({
        taskId,
        objectiveId: objective.id,
        multiplier: 0.4
      })
    })
  })
})
