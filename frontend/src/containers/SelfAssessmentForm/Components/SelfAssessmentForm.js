import React from 'react'
import ObjectiveQuestionModule from './QuestionModules/ObjectiveQuestionModule'
import CategoryQuestionModule from './QuestionModules/CategoryQuestionModule'
import OpenQuestionModule from './QuestionModules/OpenQuestionModule'
import SelfAssessmentInfo from './Sections/SelfAssessmentInfo'
import './selfAssesment.css'
import SelfAssessmentSection from './Sections/SelfAssessmentSection'
import EditCategoryModule from './QuestionModules/EditCategoryModule'
import EditObjectiveModule from './QuestionModules/EditObjectiveModule'


const SelfAssessmentForm = (props) => {
  const { edit, formData, responseErrors, clearError, preview, grades } = props
  const { structure } = formData
  const { type } = structure
  const { grade } = structure.headers
  const editMode = edit && !preview
  const questionModule = editMode ? (type === 'category' ? EditCategoryModule : EditObjectiveModule) : (type === 'category' ? CategoryQuestionModule : ObjectiveQuestionModule) //eslint-disable-line
  const finalGradeModule = (edit && !preview) ? EditCategoryModule : CategoryQuestionModule
  const dummyPropToEnsureChange = () => (
    (
      null
    )
  )
  return (
    <div>

      <SelfAssessmentInfo
        formData={formData}
        edit={editMode}
      />

      <SelfAssessmentSection
        name={structure.questionModuleName}
        formData={structure.questionModules}
        edit={edit ? !preview : false}
        changedProp={dummyPropToEnsureChange}
        QuestionModule={questionModule}
        courseInstanceId={formData.course_instance_id}
        errors={responseErrors.qModErrors}
        clearError={clearError}
        grades={grades}
      />

      {structure.openQuestions.questions.length > 0 || editMode ?
        <SelfAssessmentSection
          name={structure.openQuestions.name}
          formData={structure.openQuestions.questions}
          edit={edit ? !preview : false}
          changedProp={dummyPropToEnsureChange}
          QuestionModule={OpenQuestionModule}
          question
          errors={responseErrors.openQErrors}
          clearError={clearError}
        />
        :
        null
      }

      {structure.finalGrade.includedInAssesment || editMode ?
        <SelfAssessmentSection
          headers={grade}
          headerType="grade"
          formData={[structure.finalGrade]}
          edit={edit ? !preview : false}
          QuestionModule={finalGradeModule}
          final
          courseInstanceId={formData.course_instance_id}
          changedProp={dummyPropToEnsureChange}
          errors={responseErrors.finalGErrors}
          clearError={clearError}
          grades={grades}
        />
        :
        null}
    </div>
  )
}

export default SelfAssessmentForm
