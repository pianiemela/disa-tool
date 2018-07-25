import React from 'react'
import { Typelist } from '../../../../../containers/Course/components/types/Typelist'
import Type from '../../../../../containers/Course/components/types/Type'
import CreateTypeForm from '../../../../../containers/Course/components/types/CreateTypeForm'

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
      headerId={1}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Typelist').exists()).toEqual(true)
  })

  it('renders a Type component for each type.', () => {
    expect(wrapper.find(Type).length).toEqual(types.length)
  })

  describe('when not editing', () => {
    it('does not render an CreateTypeForm component.', () => {
      expect(wrapper.find(CreateTypeForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })
    it('renders an CreateTypeForm component.', () => {
      expect(wrapper.find(CreateTypeForm).exists()).toEqual(true)
    })
  })
})
