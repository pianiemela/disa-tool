import React from 'react'
import { Dropdown, Form, Accordion } from 'semantic-ui-react'
import { CategoryQuestionModule } from '../../../../containers/SelfAssessmentForm/Components/QuestionModules/CategoryQuestionModule'
import MatrixPage from '../../../../containers/Course/MatrixPage'


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
let wrapper
const dispatchTextFieldOnOff = jest.fn()
const dispatchToggleFormPartAction = jest.fn()
const dispatchHeaderChange = jest.fn()
const dispatchTextfieldResponsection = jest.fn()
const dispatchClearErrorAction = jest.fn()
const dispatchGradeCategoryAction = jest.fn()
const clearError = jest.fn()

beforeEach(() => {
  wrapper = shallow(<CategoryQuestionModule
    data={data}
    final={false}
    textArea={jest.fn()}
    dispatchTextFieldOnOff={dispatchTextFieldOnOff}
    dispatchToggleFormPartAction={dispatchToggleFormPartAction}
    dispatchHeaderChange={dispatchHeaderChange}
    dispatchTextfieldResponseAction={dispatchTextfieldResponsection}
    dispatchClearErrorAction={dispatchClearErrorAction}
    dispatchGradeCategoryAction={dispatchGradeCategoryAction}
    gradeError={{}}
    clearError={clearError}
    grades={[]}
    edit={false}
    translate={() => ''}
    existingAnswer={[{
      grade: null,
      id: 1,
      name: 'testi',
      textFieldOn: true,
      responseText: null
    }]}
  />)
})


describe('Category question module', () => {
  it('renders', () => {
    expect(wrapper.find('.CategoryQuestion').exists()).toEqual(true)
  })
  it('has the course matrix', () => {
    expect(wrapper.find(MatrixPage).exists()).toEqual(true)
  })
  it('displays the course matrix on click', () => {
    wrapper.find(Accordion.Title).simulate('click')
    expect(wrapper.find(Accordion.Title).props().active).toEqual(true)
  })
})
describe('with no existing response', () => {
  it('doesn\'t prefill dropdown when there isn\'t an existing grade', () => {
    const dropdown = wrapper.find(Dropdown)
    expect((dropdown).props().value).toEqual(null)
  })
  it('doesn\'t prefill textfield response when there isn\'t an existing text response', () => {
    const textfield = wrapper.find(Form.TextArea)
    expect((textfield).props().defaultValue).toEqual(null)
  })
})

describe('with existing response', () => {
  beforeEach(() => {
    wrapper.setProps({
      existingAnswer: [{
        grade_name: '1',
        grade: 6,
        id: 1,
        name: 'testi',
        textFieldOn: true,
        responseText: 'Existing response'
      }],
      grades: [{ text: '1', value: 6 }, { text: '2', value: 7 }]
    })
  })

  it('prefills the grade value with the correct grade', () => {
    expect(wrapper.find(Dropdown).props().value).toEqual(6)
  })

  it('prefills the response text field with correct response', () => {
    expect(wrapper.find(Form.TextArea).props().defaultValue).toEqual('Existing response')
  })
})

describe('with errors in form', () => {
  beforeEach(() => {
    wrapper.setProps({
      gradeError: { id: 1, error: 'You must select a value' },
      grades: [{ text: '1', value: 6 }, { text: '2', value: 7 }]
    })
  })
  it('shows the form in error mode', () => {
    const f = wrapper.find(Form)
    expect(f.props().error).toEqual(true)
  })

  it('clears the error when you select grade', () => {
    wrapper.instance().handleDropdownChange(null, { value: 7 })
    expect(dispatchGradeCategoryAction).toHaveBeenCalled()
    expect(dispatchClearErrorAction).toHaveBeenCalled()
  })
})
