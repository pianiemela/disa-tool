import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeObjectiveFromTask } from '../../services/tasks'

class DetachObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  expand = () => {
    this.setState({
      expanded: true
    })
  }

  collapse = () => {
    this.setState({
      expanded: false
    })
  }

  removeObjective = () => {
    this.props.removeObjectiveFromTask({
      taskId: this.props.task.id,
      objectiveId: this.props.objective.id
    })
    this.collapse()
  }

  render() {
    return (
      <div className="DetachObjectiveForm">
        <Modal
          trigger={<Button onClick={this.expand} color="red" icon={{ name: 'delete' }} />}
          open={this.state.expanded}
          onClose={this.collapse}
        >
          <Modal.Header>placeholder text</Modal.Header>
          <p>{'<remove prompt>'} {this.props.objective.name} {'<from>'} {this.props.task.name}</p>
          <Modal.Content>
            <div className="choiceContainer">
              <Button color="red" onClick={this.removeObjective}>
                {'<delete>'}
              </Button>
              <Button onClick={this.collapse}>
                {'<cancel>'}
              </Button>
            </div>
          </Modal.Content>
        </Modal>
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
