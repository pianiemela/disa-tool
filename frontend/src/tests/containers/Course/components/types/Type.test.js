import React from 'react'
import { Type } from '../../../../../containers/Course/components/types/Type'

const type = {
  id: 1,
  name: 'Test Type'
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
})
