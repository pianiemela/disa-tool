import React from 'react'
import UpOrDownToggle from '../../../../containers/SelfAssessmentForm/Components/UpOrDownToggle'
import { CategoryQuestionModule } from '../../../../containers/SelfAssessmentForm/Components/QuestionModules/CategoryQuestionModule'
import MultiLangInput from '../../../../containers/SelfAssessmentForm/Components/MultiLangInput'


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
      edit
      translate={() => ''}
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
  describe('with edit true', () => {
    beforeEach(() => {
      wrapper.setProps({
        edit: true
      })
    })
    it('renders', () => {
      expect(wrapper.find('.CategoryQuestion').exists()).toEqual(true)
    })

    it.skip('contains the toggle form part button', () => {
      // Unclear what button is referred to.
      expect(wrapper.find('.toggleFormPartButton').exists()).toEqual(true)
    })
    it.skip('contains the move form parts up or down element', () => {
      // Unclear wheteher this component is supposed to be found?
      expect(wrapper.find(UpOrDownToggle).exists()).toEqual(true)
    })
  })

  describe('with final', () => {
    beforeEach(() => {
      wrapper.setProps({
        final: true,
        edit: true
      })
    })

    it.skip('contains the toggle headers button', () => {
      // Unclear what button is referred to.
      expect(wrapper.find('.editHeadersButton').exists()).toEqual(true)
    })
    it.skip('shows the multilang input field, when you click the edit headers button', () => {
      // Unclear what button is referred to.
      wrapper.find('.editHeadersButton').simulate('click')
      expect(wrapper.find(MultiLangInput).exists()).toEqual(true)
    })
  })
})
