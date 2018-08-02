import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeObjective } from '../../actions/objectives'
import { addObjectiveToTask, removeObjectiveFromTask } from '../../actions/tasks'

import DeleteForm from '../../../../utils/components/DeleteForm'

export class MatrixObjective extends Component {
  toggleObjective = () => {
    if (this.props.activeTaskId !== null) {
      this.props.toggleObjective({
        objective_id: this.props.objective.id,
        task_id: this.props.activeTaskId
      })
    }
  }

  render() {
    return (
      <div className="MatrixObjective">
        <div className="objectiveBlock">
          <Button
            className="objectiveButton"
            toggle
            active={this.props.active}
            compact
            basic
            fluid
            style={{ borderRadius: '0px' }}
            onClick={this.toggleObjective}
          >
            {this.props.objective.name}
          </Button>
        </div>
        <div className="removeBlock">
          {this.props.editing ? (
            <DeleteForm
              onExecute={() => this.props.removeObjective({ id: this.props.objective.id })}
              prompt={[
                'Poistetaanko oppimistavoite',
                `"${this.props.objective.name}"`
              ]}
              header="Poista oppimistavoite"
            />
          ) : (
            null
          )}
        </div>
      </div>
    )
  }
}

MatrixObjective.propTypes = {
  objective: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeObjective: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  toggleObjective: PropTypes.func.isRequired,
  activeTaskId: PropTypes.number
}

MatrixObjective.defaultProps = {
  activeTaskId: null
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeObjective: asyncAction(removeObjective, dispatch),
  toggleObjective: ownProps.active ? (
    asyncAction(removeObjectiveFromTask, dispatch)
  ) : (
    asyncAction(addObjectiveToTask, dispatch)
  )
})

export default connect(null, mapDispatchToProps)(MatrixObjective)
