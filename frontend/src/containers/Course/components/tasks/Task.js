import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeTask, changeActive } from '../../actions/tasks'

import DeleteForm from '../../../../utils/components/DeleteForm'
import EditTaskForm from './EditTaskForm'
import MathJaxText from '../../../../utils/components/MathJaxText'

export class Task extends Component {
  translate = id => this.props.translate(`Course.tasks.Task.${id}`)

  renderExpanded() {
    if (!this.props.active) {
      return null
    }
    return (
      <div className="flexContainer">
        <div className="flexGrower flexBlock">
          <MathJaxText content={this.props.task.description} />
          <p>{this.props.task.info}</p>
        </div>
        {this.props.editing ? (
          <div className="flexBlock">
            <EditTaskForm taskId={this.props.task.id} />
            <Button onClick={this.props.openModal}>{this.translate('edit_multipliers_button')}</Button>
          </div>
         ) : null}
      </div>
    )
  }

  render() {
    return (
      <div className="Task flexContainer">
        <div className="flexGrower">
          <Button
            className="taskButton"
            onClick={() => this.props.changeActive(this.props.task.id)}
            basic={!this.props.active}
            fluid
          >
            {this.props.task.name}
          </Button>
          {this.renderExpanded()}
        </div>
        {this.props.editing ? (
          <DeleteForm
            onExecute={() => this.props.removeTask({ id: this.props.task.id })}
            prompt={[
              this.translate('delete_prompt_1'),
              `"${this.props.task.name}"`
            ]}
            header={this.translate('delete_header')}
          />
        ) : (
          null
        )}
      </div>
    )
  }
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeTask: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  changeActive: PropTypes.func.isRequired,
  openModal: PropTypes.func,
  translate: PropTypes.func.isRequired
}

Task.defaultProps = {
  openModal: () => {}
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  active: state.task.active === ownProps.task.id
})

const mapDispatchToProps = dispatch => ({
  removeTask: asyncAction(removeTask, dispatch),
  changeActive: changeActive(dispatch)
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(Task))
