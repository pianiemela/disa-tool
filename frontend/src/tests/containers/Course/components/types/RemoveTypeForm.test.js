import React from 'react'
import { RemoveTypeForm } from '../../../../../containers/Course/components/types/RemoveTypeForm'
import ModalForm from '../../../../../utils/components/ModalForm'
import { findText } from '../../../../testUtils'

const type = {
  id: 7,
  name: 'Test Type'
}
const mockFn = () => {}

describe('RemoveTypeForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RemoveTypeForm
      type={type}
      removeType={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.RemoveTypeForm').exists()).toEqual(true)
  })

  describe('form content', () => {
    let content

    beforeEach(() => {
      content = shallow(wrapper.find(ModalForm).props().content)
    })

    it('renders type name', () => {
      expect(findText(type.name, content)).toBeGreaterThan(0)
    })
  })
})
