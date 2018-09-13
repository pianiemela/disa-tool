import React from 'react'
import { Button } from 'semantic-ui-react'
import { SelfAssessmentForm } from '../../../../containers/SelfAssessmentForm/Components/SelfAssessmentForm'
import SelfAssessmentSection from '../../../../containers/SelfAssessmentForm/Components/Sections/SelfAssessmentSection'
import EditCategoryModule from '../../../../containers/SelfAssessmentForm/Components/QuestionModules/EditCategoryModule'
import EditObjectiveModule from '../../../../containers/SelfAssessmentForm/Components/QuestionModules/EditObjectiveModule'

const dispatchCreateFormAction = jest.fn()
const dispatchUpdateSelfAssesmentAction = jest.fn()
const dispatchInitNewFormAction = jest.fn()
const dispatchGetAssesmentResponseAction = jest.fn()
const dispatchGetSelfAssesmentAction = jest.fn()
const dispatchGetCourseInstanceData = jest.fn()


const formData = {
  course_instance_id: 2,
  open: false,
  active: false,
  show_feedback: false,
  structure: {
    headers: {
      openQ: {},
      questionHeaders: {},
      grade: {}
    },
    openQuestions: {}
  }
}

describe('Self assesment form', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SelfAssessmentForm
      match={{
        params: {
          courseInstanceId: 1,
          selfAssesmentId: 1,
          type: 'category'
        }
      }}
      edit={false}
      preview={false}
      grades={[]}
      clearError={jest.fn}
      responseErrors={{}}
      translate={() => ''}
    />)
  })

  describe.skip('with edit, new and category', () => {
    beforeEach(() => {
      wrapper.setProps({
        edit: true,
        new: true,
        type: 'category',
        role: 'TEACHER',
        preview: 'false',
        formData: { ...formData, structure: { ...formData.structure, type: 'category', questionModules: [{ includedinAssesment: false }], openQuestions: { questions: [] }, finalGrade: { includedinAssesment: false } } }
      })
    })
    it('renders correctly', () => {
      expect(wrapper.find('.SelfAssessmentFormPage').exists()).toEqual(true)
    })
    it('shows the correct label on the button', () => {
      expect(wrapper.find(Button).at(3).props().children).toEqual('Tallenna')
    })

    it('contains SelfAssessmentForm', () => {
      expect(wrapper.find(SelfAssessmentForm).exists()).toEqual(true)
    })
    describe.skip('with edit, new and objective', () => {
      beforeEach(() => {
        wrapper.setProps({
          edit: true,
          new: true,
          type: 'category',
          role: 'TEACHER',
          formData: { ...formData, structure: { ...formData.structure, type: 'objective', openQuestions: { questions: [] }, finalGrade: { includedinAssesment: true } } }

        })
      })
      it('contains question modules of type objective', () => {
        const questionModule = wrapper.find(SelfAssessmentSection).at(0).prop('QuestionModule')
        expect(questionModule).toEqual(EditObjectiveModule)
        expect(wrapper.find(SelfAssessmentSection).length).toEqual(3)
      })
    })

    describe.skip('with edit and existing data', () => {
      beforeEach(() => {
        wrapper.setProps({
          edit: true,
          new: false,
          type: 'category',
          role: 'TEACHER',
          formData: { ...formData, structure: { ...formData.structure, type: 'objectives', questionModules: [{ includedinAssesment: false }], openQuestions: { questions: [] }, finalGrade: { includedinAssesment: false } } }
        })
      })

      it('has the correct label on button', () => {
        expect(wrapper.find(Button).at(3).props().children).toEqual('Päivitä')
      })
    })
  })
})
