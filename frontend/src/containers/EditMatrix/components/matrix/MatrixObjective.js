import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import asyncAction from '../../../../utils/asyncAction'

import { removeObjective } from '../../services/objectives'

import DeleteForm from '../../../../utils/components/DeleteForm'

export const MatrixObjective = props => (
  <div className="MatrixObjective">
    <div className="objectiveBlock">
      <span>
        {props.objective.name}
      </span>
    </div>
    <div className="removeBlock">
      {props.editing ? (
        <DeleteForm
          onExecute={() => props.removeObjective({ id: props.objective.id })}
          prompt={[
            'Poistetaanko oppimistavoite',
            `"${props.objective.name}"`
          ]}
          header="Poista oppimistavoite"
        />
      ) : (
        <div />
      )}
    </div>
  </div>
)

MatrixObjective.propTypes = {
  objective: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeObjective: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeObjective: asyncAction(removeObjective, dispatch)
})

export default connect(null, mapDispatchToProps)(MatrixObjective)
