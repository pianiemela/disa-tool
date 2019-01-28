import React from 'react'
import { arrayOf, shape, func } from 'prop-types'
import { Link } from 'react-router-dom'
import { withLocalize } from 'react-localize-redux'
import { Label, List } from 'semantic-ui-react'

const StudentAssesmentList = ({ assesments, translate: baseTranslate }) => {
  const translate = id => baseTranslate(`UserPage.StudentAssesmentList.${id}`)
  return (
    <List selection size="big">
      {assesments.map(assesment => (
        !assesment.active ? undefined : (
          <List.Item key={assesment.id} style={{ display: 'flex' }}>
            <List.Content
              as={Link}
              to={`/selfassessment/response/${assesment.id}`}
              style={{ flexGrow: 1 }}
            >
              {assesment.name}
            </List.Content>
            <List.Content floated="right">
              <Label
                color={assesment.open ? 'green' : 'red'}
                content={assesment.open ? translate('open') : translate('closed')}
              />
              <Label
                color={assesment.assessment_responses.length > 0 ? 'green' : 'red'}
                content={assesment.assessment_responses.length > 0 ? translate('answered') : translate('unanswered')}
              />
            </List.Content>
          </List.Item>)
          ))}
    </List>
  )
}

StudentAssesmentList.propTypes = {
  assesments: arrayOf(shape({})).isRequired,
  translate: func.isRequired
}

export default withLocalize(StudentAssesmentList)
