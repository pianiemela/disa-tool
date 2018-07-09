import React from 'react'
import PropTypes from 'prop-types'

import RemoveObjectiveForm from './RemoveObjectiveForm'

const MatrixObjective = props => (
  <div className="objectiveListItem">
    <div className="objectiveBlock">
      <span>
        {props.objective.name}
      </span>
    </div>
    <div className="removeBlock">
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
