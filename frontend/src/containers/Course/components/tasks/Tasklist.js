import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './tasks.css'

import Task from './Task'

const Tasklist = props => (
  <div className="taskContainer">
    {props.tasks.map(task => <Task key={task.id} task={task} editing={props.editing} />)}
  </div>
)

Tasklist.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  editing: PropTypes.bool
}

Tasklist.defaultProps = {
  editing: false
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    tasks: state.task.tasks
  }
}

export default connect(mapStateToProps, null)(Tasklist)
