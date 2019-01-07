import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'
import './tasks.css'

import Task from './Task'
import AddTaskForm from './AddTaskForm'

export const Tasklist = (props) => {
  const tasks = props.tasks.sort((a, b) => a.order - b.order)
  let newOrder = 1
  const tasksNode = tasks.map((task, index, tasksArray) => {
    const slots = {
      previous: index > 0 ? (task.order + tasksArray[index - 1].order) / 2 : task.order - 1,
      next: index < tasksArray.length - 1 ? (
        (task.order + tasksArray[index + 1].order) / 2
      ) : task.order + 1
    }
    if (index === tasksArray.length - 1) { newOrder = slots.next }
    return (
      <Task
        key={task.id}
        task={task}
        editing
        openModal={props.openModal}
        slots={slots}
      />
    )
  })
  return (
    <Container>
      {tasksNode}
      {props.editing ? (
        <AddTaskForm courseId={props.courseId} newOrder={newOrder} />
      ) : (
        null
      )}
    </Container>
  )
}

Tasklist.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  courseId: PropTypes.number.isRequired,
  openModal: PropTypes.func
}

Tasklist.defaultProps = {
  openModal: () => {}
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  tasks: state.task.tasks
})

export default connect(mapStateToProps, null)(Tasklist)
