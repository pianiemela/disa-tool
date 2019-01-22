import React from 'react'
import { arrayOf, shape, func } from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, List } from 'semantic-ui-react'
import DeleteForm from '../../../utils/components/DeleteForm'
import { removeSelfAssesment } from '../actions/selfAssesment'
import asyncAction from '../../../utils/asyncAction'

const TeacherAssesmentList = ({
  assesments,
  toggleAssessment,
  translate: baseTranslate,
  deleteSelfAssesment
}) => {
  const translate = id => baseTranslate(`UserPage.TeacherAssesmentList.${id}`)
  return (
    <List selection size="big">
      {assesments.map(assesment => (
        <List.Item key={assesment.id} style={{ display: 'flex' }}>
          <List.Content
            as={Link}
            to={`/selfassessment/list/${assesment.id}`}
            style={{ flexGrow: 1 }}
          >
            {assesment.name}
          </List.Content>
          <List.Content
            style={{ paddingRight: '10px', paddingLeft: '10px' }}
          >
            <DeleteForm
              onExecute={() => deleteSelfAssesment(assesment.id)}
              header={translate('delete_header')}
              prompt={[
                translate('delete_prompt_1'),
                assesment.name
              ]}
              translate={baseTranslate}
            />
          </List.Content>
          <List.Content>
            <Button
              name="assessmentActive"
              color={assesment.active ? 'green' : 'red'}
              compact
              content={assesment.active ? translate('visible') : translate('hidden')}
              disabled={assesment.open}
              size="small"
              value={assesment.id}
              onClick={toggleAssessment}
            />
            <Button
              name="assessmentOpen"
              color={assesment.open ? 'green' : 'red'}
              compact
              content={assesment.open ? translate('open') : translate('closed')}
              disabled={!assesment.active}
              size="small"
              value={assesment.id}
              onClick={toggleAssessment}
            />
            <Button
              name="feedbackOpen"
              color={assesment.show_feedback ? 'green' : 'red'}
              compact
              content={assesment.show_feedback ? translate('feedback_open') : translate('feedback_closed')}
              size="small"
              value={assesment.id}
              onClick={toggleAssessment}
            />
          </List.Content>
        </List.Item>))}
    </List>
  )
}

TeacherAssesmentList.propTypes = {
  assesments: arrayOf(shape({})).isRequired,
  toggleAssessment: func.isRequired,
  translate: func.isRequired,
  deleteSelfAssesment: func.isRequired
}

const mapDispatchToProps = dispatch => ({
  deleteSelfAssesment: asyncAction(removeSelfAssesment, dispatch)
})

export default connect(null, mapDispatchToProps)(withLocalize(TeacherAssesmentList))
