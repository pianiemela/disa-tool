import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './tasks.css'

import Task from './Task'
import AddTaskForm from './AddTaskForm'

export const Tasklist = props => (
  <div className="Tasklist">
    {props.tasks.map(task => (<Task
      key={task.id}
      task={task}
      editing
    />))}
    {props.editing ? (
      <AddTaskForm courseId={props.courseId} />
    ) : (
      null
    )}
  </div>
)

Tasklist.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  tasks: state.task.tasks
})

export default connect(mapStateToProps, null)(Tasklist)
