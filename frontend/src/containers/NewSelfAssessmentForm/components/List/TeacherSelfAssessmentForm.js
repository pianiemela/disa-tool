import React from 'react'
import { shape, func, number, string, bool } from 'prop-types'
import { List, Button, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { withLocalize } from 'react-localize-redux'
import { getLanguage } from '../../../../utils/utils'
import Conditional from '../../../../utils/components/Conditional'
import { editSelfAssessmentForm, deleteSelfAssessmentForm } from '../../actions/selfAssessmentForm'
import DeleteForm from '../../../../utils/components/DeleteForm'

const TeacherSelfAssessmentForm = ({
  selfAssessmentForm,
  dispatchSelfAssessmentForms,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.List.TeacherSelfAssessmentForm.${id}`)
  const lang = getLanguage()

  const saveEdit = (edited) => {
    dispatchSelfAssessmentForms({
      type: 'UPDATE',
      edited: {
        id: selfAssessmentForm.id,
        ...edited
      }
    })
    editSelfAssessmentForm(selfAssessmentForm.id, {
      ...selfAssessmentForm,
      ...edited
    })
  }
  const remove = () => {
    dispatchSelfAssessmentForms({
      type: 'DELETE',
      deleted: selfAssessmentForm
    })
    deleteSelfAssessmentForm(selfAssessmentForm.id)
  }

  const hide = () => saveEdit({
    active: false,
    open: false
  })
  const open = () => saveEdit({
    active: true,
    open: true
  })
  const close = () => saveEdit({
    active: true,
    open: false
  })
  const toggleFeedback = () => saveEdit({
    show_feedback: !selfAssessmentForm.show_feedback
  })

  return (
    <List.Item style={{ display: 'flex' }}>
      <List.Content
        as={Link}
        to={`/selfassessment/list/${selfAssessmentForm.id}`}
        style={{ flexGrow: 1 }}
      >
        {selfAssessmentForm[`${lang}_name`]}
      </List.Content>
      <List.Content
        style={{ paddingRight: '10px', paddingLeft: '10px' }}
      >
        <Conditional visible={selfAssessmentForm.open}>
          <Popup
            trigger={
              <div style={{ display: 'inline' }}>
                <Button
                  disabled
                  icon="edit"
                  circular
                  size="mini"
                  basic
                  color="blue"
                  as={Link}
                  to={`/self-assessment-form/${selfAssessmentForm.id}/edit`}
                />
              </div>
            }
            content={translate('cannot_edit_open_assessment')}
          />
        </Conditional>
        <Conditional visible={!selfAssessmentForm.open}>
          <Button
            icon="edit"
            circular
            size="mini"
            basic
            color="blue"
            as={Link}
            to={`/self-assessment-form/${selfAssessmentForm.id}/edit`}
          />
        </Conditional>
        <DeleteForm
          onExecute={remove}
          header={translate('delete_header')}
          prompt={[
            translate('delete_prompt_1'),
            selfAssessmentForm.name
          ]}
          translate={baseTranslate}
        />
      </List.Content>
      <List.Content>
        <Button.Group size="small">
          <Button
            content={translate('hidden')}
            size="small"
            onClick={hide}
            positive={!selfAssessmentForm.active && !selfAssessmentForm.open}
          />
          <Button.Or />
          <Button
            content={translate('open')}
            size="small"
            onClick={open}
            positive={selfAssessmentForm.active && selfAssessmentForm.open}
          />
          <Button.Or />
          <Button
            content={translate('closed')}
            size="small"
            onClick={close}
            positive={selfAssessmentForm.active && !selfAssessmentForm.open}
          />
        </Button.Group>
        <Button
          name="feedbackOpen"
          color={selfAssessmentForm.show_feedback ? 'green' : 'red'}
          content={selfAssessmentForm.show_feedback ? translate('feedback_open') : translate('feedback_closed')}
          size="small"
          value={selfAssessmentForm.id}
          onClick={toggleFeedback}
          style={{ marginLeft: '5px' }}
        />
      </List.Content>
    </List.Item>
  )
}

TeacherSelfAssessmentForm.propTypes = {
  selfAssessmentForm: shape({
    id: number.isRequired,
    eng_name: string.isRequired,
    fin_name: string.isRequired,
    swe_name: string.isRequired,
    open: bool.isRequired,
    active: bool.isRequired,
    show_feedback: bool.isRequired
  }).isRequired,
  dispatchSelfAssessmentForms: func.isRequired,
  translate: func.isRequired
}

export default withLocalize(TeacherSelfAssessmentForm)
