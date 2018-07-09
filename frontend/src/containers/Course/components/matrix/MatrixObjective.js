import React from 'react'
import PropTypes from 'prop-types'

import RemoveObjectiveForm from './RemoveObjectiveForm'

const MatrixObjective = props => (
  <div className="objectiveListItem">
    <span>
      {props.objective.name}
    </span>
    <div className="objectiveBlock">
      {props.editing ? (
        <RemoveObjectiveForm objective={props.objective} />
      ) : (
        <div />
      )}
    </div>
  </div>
)

MatrixObjective.propTypes = {
  objective: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired
}

export default MatrixObjective
