import React from 'react'
import { Type } from '../../../../../containers/Course/components/types/Type'

const type = {
  id: 1,
  name: 'Test Type',
  multiplier: 0.5
}

describe('Type component', () => {
  let wrapper
  let changeTypeMultiplier

  beforeEach(() => {
    changeTypeMultiplier = jest.fn()
    wrapper = shallow(<Type
      type={type}
      changeTypeMultiplier={changeTypeMultiplier}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Type').exists()).toEqual(true)
  })

  describe('number input', () => {
    let numberInput

    beforeEach(() => {
      numberInput = wrapper.find('.numberInput')
    })

    it('renders with the correct value.', () => {
      expect(numberInput.props().value).toEqual(type.multiplier)
    })

    it('calls changeTypeMultiplier when value is changed.', () => {
      numberInput.simulate('change', {
        target: {
          value: 0.4
        }
      })
      expect(changeTypeMultiplier).toHaveBeenCalledWith({
        id: type.id,
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
      expect(rangeInput.props().value).toEqual(type.multiplier)
    })

    it('calls changeTypeMultiplier when value is changed.', () => {
      rangeInput.simulate('change', {
        target: {
          value: 0.4
        }
      })
      expect(changeTypeMultiplier).toHaveBeenCalledWith({
        id: type.id,
        multiplier: 0.4
      })
    })
  })
})
