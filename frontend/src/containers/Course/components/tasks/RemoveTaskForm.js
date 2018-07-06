import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class RemoveTaskForm extends Component {
  removeTask = () => {
    this.props.removeTask({
      id: this.props.task.id
    })
  }

  render() {
    return (
      <div className="RemoveTaskForm">
        <ModalForm
          header="placeholder content"
          trigger={<Button className="removeTaskButton" icon={{ name: 'remove' }} color="red" />}
          content={
            <div>
              <p>Remove {this.props.task.name}</p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeTask}>
                  {'<delete>'}
                </Button>
                <Button>
                  {'<cancel>'}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

RemoveTaskForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  removeTask: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeTask: asyncAction(removeTask, dispatch)
})

export default connect(null, mapDispatchToProps)(RemoveTaskForm)
