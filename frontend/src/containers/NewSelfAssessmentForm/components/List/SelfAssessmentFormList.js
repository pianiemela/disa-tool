import React, { useReducer, useEffect } from 'react'
import { bool, number, func } from 'prop-types'
import { List, Item, Header } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import StudentSelfAssessmentForm from './StudentSelfAssessmentForm'
import TeacherSelfAssessmentForm from './TeacherSelfAssessmentForm'
import { getSelfAssessmentFormsByCourse } from '../../actions/selfAssessmentForm'
import Conditional from '../../../../utils/components/Conditional'

const selfAssessmentFormReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ALL':
      return action.data
    case 'DELETE':
      return state.filter(selfAssessmentForm => selfAssessmentForm.id !== action.deleted.id)
    case 'UPDATE':
      return state.map(selfAssessmentForm => (
        selfAssessmentForm.id === action.edited.id ? {
          ...selfAssessmentForm,
          ...action.edited
        } : selfAssessmentForm
      ))
    default:
      return state
  }
}

export const SelfAssessmentFormList = ({
  courseInstanceId,
  isTeacher,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.List.SelfAssessmentFormList.${id}`)
  const [
    selfAssessmentForms,
    dispatchSelfAssessmentForms
  ] = useReducer(selfAssessmentFormReducer, [])

  useEffect(() => {
    getSelfAssessmentFormsByCourse(courseInstanceId).then(({ data }) => {
      dispatchSelfAssessmentForms({
        type: 'GET_ALL',
        data
      })
    })
  }, [courseInstanceId])
  return (
    <Item.Content>
      <Conditional visible={selfAssessmentForms.length > 0}>
        <Header as="h3">{translate('self_assessments')}</Header>
      </Conditional>
      <List selection divided size="big">
        {selfAssessmentForms.map(selfAssessmentForm => (
          isTeacher ? (
            <TeacherSelfAssessmentForm
              key={selfAssessmentForm.id}
              selfAssessmentForm={selfAssessmentForm}
              dispatchSelfAssessmentForms={dispatchSelfAssessmentForms}
            />
          ) : (
            <StudentSelfAssessmentForm
              key={selfAssessmentForm.id}
              selfAssessmentForm={selfAssessmentForm}
            />
          )
        ))}
      </List>
    </Item.Content>
  )
}

SelfAssessmentFormList.propTypes = {
  isTeacher: bool.isRequired,
  courseInstanceId: number.isRequired,
  translate: func.isRequired
}

export default withLocalize(SelfAssessmentFormList)
