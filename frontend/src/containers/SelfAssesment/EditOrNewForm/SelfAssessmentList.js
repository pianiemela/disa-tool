import React from 'react'
import { List } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

const SelfAssessmentList = (props) => {
  const { selfAssessments, onClick } = props
  const visible = selfAssessments.length > 0
  const translate = id => props.translate(`SelfAssessment.EditOrNewForm.SelfAssessmentList.${id}`)

  if (visible) {
    return (
      <List animated selection>
        <List.Header>{translate('header')}</List.Header>
        {selfAssessments.map(sa => (
          <List.Item
            key={sa.id}
            onClick={() => onClick('edit', null, sa.id)}
          >
            {sa.name}
          </List.Item>
        ))}
      </List>
    )
  }
  return (
    ''
  )
}

export default withLocalize(SelfAssessmentList)
