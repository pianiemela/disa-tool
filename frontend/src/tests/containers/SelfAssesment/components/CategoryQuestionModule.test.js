import React from 'react'
import UpOrDownToggle from '../../../../containers/SelfAssesment/Userform/FormParts/UpOrDownToggle'
import { CategoryQuestionModule } from '../../../../containers/SelfAssesment/Userform/FormParts/QuestionModules/CategoryQuestionModule'
import MultiLangInput from '../../../../containers/SelfAssesment/Userform/FormParts/MultiLangInput'


const data = {
  name: 'Testi',
  textFieldOn: true,
  id: 1,
  includedInAssesment: true,
  headers: [
    { value: 'eka' },
    { value: 'toka' }
  ]
}
describe('Category question module', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<CategoryQuestionModule
      data={data}
      final={false}
      textArea={jest.fn()}
      dispatchTextFieldOnOff={jest.fn()}
      dispatchToggleFormPartAction={jest.fn()}
      dispatchHeaderChange={jest.fn()}
      dispatchTextfieldResponseAction={jest.fn()}
      dispatchGradeCategoryAction={jest.fn()}
      clearError={jest.fn()}
      grades={[]}
    />)
  })

  describe('with edit false', () => {
    it('renders', () => {
      expect(wrapper.find('.CategoryQuestion').exists()).toEqual(true)
    })
    it('does not contain the edit button for headers', () => {
      expect(wrapper.find('.editHeadersbutton').exists()).toEqual(false)
    })
    it('does not contain the toggle form part button', () => {
      expect(wrapper.find('.toggleFormPartButton').exists()).toEqual(false)
    })
  })
  describe.skip('with edit true', () => {
    beforeEach(() => {
      wrapper.setProps({
        edit: true
      })
    })
    it('renders', () => {
      expect(wrapper.find('.CategoryQuestion').exists()).toEqual(true)
    })

    it('contains the toggle form part button', () => {
      expect(wrapper.find('.toggleFormPartButton').exists()).toEqual(true)
    })
    it('contains the move form parts up or down element', () => {
      expect(wrapper.find(UpOrDownToggle).exists()).toEqual(true)
    })
  })

  describe.skip('with final', () => {
    beforeEach(() => {
      wrapper.setProps({
        final: true,
        edit: true
      })
    })

    it('contains the toggle headers button', () => {
      expect(wrapper.find('.editHeadersButton').exists()).toEqual(true)
    })
    it('shows the multilang input field, when you click the edit headers button', () => {
      wrapper.find('.editHeadersButton').simulate('click')
      expect(wrapper.find(MultiLangInput).exists()).toEqual(true)
    })
  })
})
