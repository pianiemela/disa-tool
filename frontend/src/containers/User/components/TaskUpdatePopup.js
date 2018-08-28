import React, { Component } from 'react'
import { bool, func, number, string, shape } from 'prop-types'
import { Button, Input, Popup } from 'semantic-ui-react'

class TaskUpdatePopup extends Component {
  shouldComponentUpdate(nextProps) {
    // update always if content changes
    if (nextProps.task.text !== this.props.task.text) {
      return true
    }
    // update if the pop-up opens and this is the cell it needs to be open at
    if (nextProps.popUp.show && nextProps.popUp.task.taskId === nextProps.task.id
      && nextProps.popUp.person.id === nextProps.person.id) {
      return true
    }
    // update if the pop-up closes at this cell
    if (!nextProps.popUp.show && this.props.popUp.show
      && this.props.popUp.task.taskId === this.props.task.id
      && this.props.popUp.person.id === this.props.person.id) {
      return true
    }
    return false
  }

  render() {
    const { person, task, popUp, markTask, updateTask } = this.props
    return (
      <Popup
        trigger={
          <Button
            content={task.text}
            basic
            size="small"
            icon="edit"
            color={task.color}
            onClick={markTask}
            task={task}
            person={person}
          />}
        on="click"
        content={
          <div>
            <Input
              name="input"
              onChange={updateTask}
              value={popUp.show ? popUp.task.points : 0}
            />
            <Button
              basic
              name="update"
              size="tiny"
              content="päivitä"
              color="green"
              task={popUp.task}
              onClick={updateTask}
            />
            <Button
              basic
              name="cancel"
              size="tiny"
              color="red"
              content="peru muutokset"
              task={popUp.task}
              onClick={updateTask}
            />
          </div>}
        open={
      popUp.show &&
      popUp.task.taskId === task.id &&
      popUp.person.id === person.id}
      />
    )
  }
}

TaskUpdatePopup.propTypes = {
  task: shape({
    color: string.isRequired,
    id: number.isRequired,
    text: string.isRequired
  }).isRequired,
  person: shape({
    id: number.isRequired
  }).isRequired,
  popUp: shape({
    show: bool.isRequired,
    task: shape(),
    person: shape()
  }).isRequired,
  markTask: func.isRequired,
  updateTask: func.isRequired
}

export default TaskUpdatePopup
