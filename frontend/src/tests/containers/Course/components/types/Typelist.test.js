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
const activeMap = {
  2: true,
  3: true
}

describe('Typelist component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Typelist
      types={types}
      headerId={1}
      editing={false}
      activeTaskId={1}
      activeMap={activeMap}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Typelist').exists()).toEqual(true)
  })

  it('renders a Type component for each type.', () => {
    expect(wrapper.find(Type).length).toEqual(types.length)
  })

  it('Passes the active prop to correct Types.', () => {
    wrapper.find(Type).forEach(type => expect(type.prop('active')).toEqual(Boolean(activeMap[type.prop('type').id])))
  })

  describe('when not editing', () => {
    it('does not render an CreateTypeForm component.', () => {
      expect(wrapper.find(CreateTypeForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        editing: true
      })
    })
    it('renders an CreateTypeForm component.', () => {
      expect(wrapper.find(CreateTypeForm).exists()).toEqual(true)
    })
  })
})
