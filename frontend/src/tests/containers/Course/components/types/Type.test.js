import React from 'react'
import { Type } from '../../../../../containers/Course/components/types/Type'
import DeleteForm from '../../../../../utils/components/DeleteForm'
import EditTypeForm from '../../../../../containers/Course/components/types/EditTypeForm'
import { findText } from '../../../../testUtils'

const type = {
  id: 1,
  name: 'Test Type',
  multiplier: 0.5
}

describe('Type component', () => {
  let wrapper
  let removeType
  let toggleType

  beforeEach(() => {
    removeType = jest.fn()
    toggleType = jest.fn()
    wrapper = shallow(<Type
      type={type}
      editing={false}
      removeType={removeType}
      activeTaskId={null}
      active={false}
      toggleType={toggleType}
      translate={() => ''}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Type').exists()).toEqual(true)
  })

  it('renders type name.', () => {
    expect(findText(type.name, wrapper)).toBeGreaterThan(0)
  })

  it('renders type multiplier.', () => {
    expect(findText(type.multiplier.toFixed(2), wrapper)).toBeGreaterThan(0)
  })

  describe('when not editing', () => {
    it('does not render a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(false)
    })

    it('does not render an EditTypeForm component.', () => {
      expect(wrapper.find(EditTypeForm).exists()).toEqual(false)
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

    it('renders an EditTypeForm component.', () => {
      expect(wrapper.find(EditTypeForm).exists()).toEqual(true)
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

  describe('when activeTaskId is null', () => {
    it('does not call toggleType prop when clicked.', () => {
      wrapper.find('.Type').prop('onClick')()
      expect(toggleType).not.toHaveBeenCalled()
    })
  })

  describe('when activeTaskId is not null', () => {
    beforeEach(() => {
      wrapper.setProps({
        activeTaskId: 3
      })
    })

    it('calls toggleType prop when clicked.', () => {
      wrapper.find('.Type').prop('onClick')()
      expect(toggleType).toHaveBeenCalledWith({
        task_id: 3,
        type_id: type.id
      })
    })
  })

  describe('when not active', () => {
    it('is not a special colour.', () => {
      expect(wrapper.find('.Type').prop('style').backgroundColor).not.toBeDefined()
    })
  })

  describe('when active', () => {
    beforeEach(() => {
      wrapper.setProps({
        active: true
      })
    })

    it('is coloured.', () => {
      expect(wrapper.find('.Type').prop('style').backgroundColor).toBeDefined()
    })
  })
})
