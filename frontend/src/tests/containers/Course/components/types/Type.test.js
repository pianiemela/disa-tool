import React from 'react'
import { Type } from '../../../../../containers/Course/components/types/Type'
import DeleteForm from '../../../../../utils/components/DeleteForm'
import { findText } from '../../../../testUtils'

const type = {
  id: 1,
  name: 'Test Type',
  multiplier: 0.5
}

describe('Type component', () => {
  let wrapper
  let changeTypeMultiplier
  let removeType

  beforeEach(() => {
    removeType = jest.fn()
    changeTypeMultiplier = jest.fn()
    wrapper = shallow(<Type
      type={type}
      changeTypeMultiplier={changeTypeMultiplier}
      editing={false}
      removeType={removeType}
      activeTaskId={null}
      active={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Type').exists()).toEqual(true)
  })

  it('renders type name', () => {
    expect(findText(type.name, wrapper)).toBeGreaterThan(0)
  })

  describe('when not editing', () => {
    it('does not render a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })
    it('renders a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(true)
    })

    describe('DeleteForm component', () => {
      let deleteForm
      beforeEach(() => {
        deleteForm = wrapper.find(DeleteForm)
      })

      it('includes type names in prompt.', () => {
        const prompt = deleteForm.prop('prompt')
        expect(prompt.filter(segment => segment.includes(type.name)).length).toBeGreaterThan(0)
      })

      it('gets the removeType prop as part of onExecute.', () => {
        deleteForm.prop('onExecute')()
        expect(removeType).toHaveBeenCalled()
      })
    })
  })
})
