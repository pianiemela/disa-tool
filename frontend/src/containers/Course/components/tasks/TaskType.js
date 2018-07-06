import React from 'react'
import PropTypes from 'prop-types'
import { Segment } from 'semantic-ui-react'

import DetachTypeForm from './DetachTypeForm'

const TaskType = props => (
  <div className="TaskType">
    <Segment className="TaskTypeContainer">
      <span className="TaskTypeName">
        {props.type.name}
      </span>
      {props.editing ? (
        <DetachTypeForm type={props.type} task={props.task} />
      ) : (
        <div />
      )}
    </Segment>
  </div>
)

TaskType.propTypes = {
  type: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }).isRequired,
  editing: PropTypes.bool
}

TaskType.defaultProps = {
  editing: false
}

export default TaskType
