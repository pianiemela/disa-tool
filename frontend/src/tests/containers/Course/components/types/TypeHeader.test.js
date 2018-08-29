import React from 'react'
import { TypeHeader } from '../../../../../containers/Course/components/types/TypeHeader'
import Typelist from '../../../../../containers/Course/components/types/Typelist'
import DeleteForm from '../../../../../utils/components/DeleteForm'

import { findText } from '../../../../testUtils'

const header = {
  id: 20,
  name: 'Head',
  types: []
}

describe('TypeHeader component', () => {
  let wrapper
  let removeHeader

  beforeEach(() => {
    removeHeader = jest.fn()
    wrapper = shallow(<TypeHeader
      header={header}
      editing={false}
      removeHeader={removeHeader}
      translate={() => ''}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.TypeHeader').exists()).toEqual(true)
  })

  it('renders header name.', () => {
    expect(findText(header.name, wrapper)).toBeGreaterThan(0)
  })

  it('renders a Typelist component.', () => {
    expect(wrapper.find(Typelist).exists()).toEqual(true)
  })

  describe('when not editing', () => {
    it('does not render a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
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

      it('includes header name in prompt.', () => {
        const prompt = deleteForm.prop('prompt')
        expect(prompt.filter(segment => segment.includes(header.name)).length).toBeGreaterThan(0)
      })

      it('gets the removeHeader prop as part of onExecute.', () => {
        deleteForm.prop('onExecute')()
        expect(removeHeader).toHaveBeenCalled()
      })
    })
  })
})
