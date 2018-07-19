import React from 'react'
import PropTypes from 'prop-types'

import ObjectiveSlider from './ObjectiveSlider'
import DetachObjectiveForm from './DetachObjectiveForm'

const TaskObjective = props => (
  <div className="TaskObjective">
    {props.editing ? (
      <DetachObjectiveForm task={props.task} objective={props.objective} />
    ) : (
      <div />
    )}
    <ObjectiveSlider objective={props.objective} taskId={props.task.id} />
  </div>
)

TaskObjective.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  objective: PropTypes.shape({}).isRequired,
  editing: PropTypes.bool.isRequired
}

export default TaskObjective
