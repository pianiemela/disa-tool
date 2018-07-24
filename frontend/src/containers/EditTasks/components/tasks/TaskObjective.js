import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import asyncAction from '../../../../utils/asyncAction'

import { removeObjectiveFromTask } from '../../services/tasks'

import ObjectiveSlider from './ObjectiveSlider'
import DeleteForm from '../../../../utils/components/DeleteForm'

export const TaskObjective = props => (
  <div className="TaskObjective">
    {props.editing ? (
      <DeleteForm
        onExecute={() => props.removeObjectiveFromTask({
          taskId: props.task.id,
          objectiveId: props.objective.id
        })}
        prompt={[
          'Poistetaanko oppimistavoite',
          `"${props.objective.name}"`,
          'tehtävästä',
          `"${props.task.name}"`
        ]}
        header="Poista oppimistavoite tehtävästä"
      />
    ) : (
      null
    )}
    <ObjectiveSlider objective={props.objective} taskId={props.task.id} />
  </div>
)

TaskObjective.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  objective: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeObjectiveFromTask: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeObjectiveFromTask: asyncAction(removeObjectiveFromTask, dispatch)
})

export default connect(null, mapDispatchToProps)(TaskObjective)
