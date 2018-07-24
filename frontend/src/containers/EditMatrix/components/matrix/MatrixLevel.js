import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

import CreateObjectiveForm from './CreateObjectiveForm'
import MatrixObjective from './MatrixObjective'

const MatrixLevel = props => (
  <Table.Cell textAlign="center" key={props.level.id} className="MatrixLevel">
    <div>
      {props.level.objectives.map(objective => (
        <MatrixObjective
          key={objective.id}
          objective={objective}
          editing={props.editing}
          active={Boolean(props.activeMap[objective.id])}
        />
      ))}
    </div>
    {props.editing ? (
      <CreateObjectiveForm
        levelId={props.level.id}
        category={props.category}
        courseId={props.courseId}
      />
    ) : (
      null
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
  editing: PropTypes.bool.isRequired,
  activeMap: PropTypes.objectOf(PropTypes.bool).isRequired
}

MatrixLevel.defaultProps = {
  courseId: null
}

export default MatrixLevel
