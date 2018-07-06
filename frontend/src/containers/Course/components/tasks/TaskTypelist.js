import React from 'react'
import PropTypes from 'prop-types'

import TaskType from './TaskType'

const TaskTypelist = props => (
  <div className="TaskTypelist">
    {props.types.map(type => (
      <TaskType key={type.id} type={type} task={props.task} editing={props.editing} />
    ))}
  </div>
)

TaskTypelist.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }).isRequired,
  editing: PropTypes.bool
}

TaskTypelist.defaultProps = {
  editing: false
}

export default TaskTypelist
