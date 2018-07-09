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
    const contentPrompt = [
      'Poistetaanko tehtävä',
      `"${this.props.task.name}"`
    ].join(' ')
    return (
      <div className="RemoveTaskForm">
        <ModalForm
          header="Poista tehtävä"
          trigger={<Button className="removeTaskButton" icon={{ name: 'remove' }} color="red" />}
          content={
            <div>
              <p>
                {contentPrompt}?
              </p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeTask}>
                  {'Poista'}
                </Button>
                <Button>
                  {'Peru'}
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
