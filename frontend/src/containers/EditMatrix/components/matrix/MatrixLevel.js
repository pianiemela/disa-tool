import React from 'react'
import PropTypes from 'prop-types'
import { Table, List } from 'semantic-ui-react'

import CreateObjectiveForm from './CreateObjectiveForm'
import MatrixObjective from './MatrixObjective'

const MatrixLevel = props => (
  <Table.Cell textAlign="center" key={props.level.id} className="MatrixLevel">
    <List selection>
      {props.level.objectives.map(objective => (
        <List.Item key={objective.id}>
          <MatrixObjective objective={objective} editing={props.editing} />
        </List.Item>
      ))}
    </List>
    {props.editing ? (
      <CreateObjectiveForm
        levelId={props.level.id}
        category={props.category}
        courseId={props.courseId}
      />
    ) : (
      <div />
    )}
  </Table.Cell>
)

MatrixLevel.propTypes = {
  category: PropTypes.shape({}).isRequired,
  level: PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectives: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired
  }).isRequired,
  courseId: PropTypes.number,
  editing: PropTypes.bool.isRequired
}

MatrixLevel.defaultProps = {
  courseId: null
}

export default MatrixLevel
