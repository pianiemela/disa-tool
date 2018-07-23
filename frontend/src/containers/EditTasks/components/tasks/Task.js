import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeTask } from '../../services/tasks'

import DeleteForm from '../../../../utils/components/DeleteForm'

export class Task extends Component {
  renderExpanded() {
    if (!this.props.active) {
      return <div />
    }
    return (
      <div>
        <p>{this.props.task.description}</p>
        <p>{this.props.task.info}</p>
      </div>
    )
  }

  render() {
    return (
      <div className="Task">
        <div className="taskUncollapseable">
          <Button
            onClick={this.props.toggleActive}
            basic={!this.props.active}
            fluid
          >
            {this.props.task.name}
          </Button>
          {this.props.editing ? (
            <DeleteForm
              onExecute={() => this.props.removeTask({ id: this.props.task.id })}
              prompt={[
                'Poistetaanko tehtävä',
                `"${this.props.task.name}"`
              ]}
              header="Poista tehtävä"
            />
          ) : (
            <div />
          )}
        </div>
        {this.renderExpanded()}
      </div>
    )
  }
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    objectives: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number
    })).isRequired,
    types: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeTask: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  toggleActive: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeTask: asyncAction(removeTask, dispatch)
})

export default connect(null, mapDispatchToProps)(Task)
