import React from 'react'
import { connect } from 'react-redux'
import './tasks.css'

import Task from './Task'

const Tasklist = props => (
  <div className="taskContainer">
    {props.tasks.map(task => <Task key={task.id} task={task} editing={props.editing} />)}
  </div>
)

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    tasks: state.task.tasks
  }
}

export default connect(mapStateToProps, null)(Tasklist)
