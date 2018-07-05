import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeObjectiveFromTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class DetachObjectiveForm extends Component {
  removeObjective = () => {
    this.props.removeObjectiveFromTask({
      taskId: this.props.task.id,
      objectiveId: this.props.objective.id
    })
  }

  render() {
    return (
      <div className="DetachObjectiveForm">
        <ModalForm
          header="placeholder text"
          trigger={<Button color="red" icon={{ name: 'delete' }} />}
          content={
            <div>
              <p>PLACEHOLDER: Remove {this.props.objective.name} from {this.props.task.name}</p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeObjective}>
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

DetachObjectiveForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  objective: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  removeObjectiveFromTask: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeObjectiveFromTask: asyncAction(removeObjectiveFromTask, dispatch)
})

export default connect(null, mapDispatchToProps)(DetachObjectiveForm)
