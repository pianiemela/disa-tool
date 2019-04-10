import React from 'react'
import { string, number, shape } from 'prop-types'
import { Table } from 'semantic-ui-react'
import MathJaxText from '../../../../utils/components/MathJaxText'

const ObjectiveFeedback = ({
  response
}) => (
  <Table.Row>
    <Table.Cell>
      <MathJaxText content={response.objectiveName} />
    </Table.Cell>
    <Table.Cell>
      {response.answer}
    </Table.Cell>
  </Table.Row>
)

ObjectiveFeedback.propTypes = {
  response: shape({
    objectiveName: string.isRequired,
    answer: number.isRequired
  })
}

ObjectiveFeedback.defaultProps = {
  response: {
    objectiveName: '',
    answer: null
  }
}

export default ObjectiveFeedback
