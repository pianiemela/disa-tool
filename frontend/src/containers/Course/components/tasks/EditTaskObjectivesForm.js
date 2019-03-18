import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Form, Modal, Container } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { objectivesDetails } from '../../../../api/tasks'
import { editTaskObjectives } from '../../actions/tasks'
import ChangeObjectiveMultiplier from './ChangeObjectiveMultiplier'
import ChangeAllObjectivesMultipliers from './ChangeAllObjectivesMultipliers'

class EditTaskObjectivesForm extends Component {
  state = {
    expanded: false,
    detailed: true,
    loading: true,
    values: {
      0: {
        multiplier: this.props.defaultMultiplier,
        modified: false
      }
    }
  }


  changeMultiplier = id => e => this.setState({
    values: {
      ...this.state.values,
      [id]: {
        ...this.state.values[id],
        multiplier: e.target.value
      }
    }
  })

  changeModified = (id, modified) => () => this.setState({
    values: {
      ...this.state.values,
      [id]: {
        multiplier: modified ? this.state.values[id].multiplier : this.props.defaultMultiplier,
        modified
      }
    }
  })

  editTaskObjectivesSubmit = (e) => {
    e.preventDefault()
    this.props.editTaskObjectives({
      task_id: this.props.taskId,
      objectives: this.props.objectives.map(objective => ({
        ...(this.state.detailed ? this.state.values[objective.id] : this.state.values[0]),
        id: objective.id
      })).filter(objective => objective.modified !== null)
    }).then(this.collapse)
    this.setState({
      loading: true
    })
  }

  loadDetails = async () => {
    this.setState({ loading: true, expanded: true })
    const details = (await this.props.objectivesDetails({ id: this.props.taskId })).data.data
    this.setState({
      loading: false,
      values: details.reduce((acc, curr) => ({
        ...acc,
        [curr.objective_id]: {
          modified: curr.modified,
          multiplier: curr.multiplier
        }
      }), this.state.values)
    })
  }

  collapse = () => {
    if (this.state.expanded) {
      this.setState({ expanded: false })
    }
  }
  translate = id => this.props.translate(`Course.tasks.EditTaskObjectivesForm.${id}`)

  render() {
    return (
      <div className="EditTaskObjectivesForm">
        <Modal
          open={this.state.expanded}
          trigger={
            <Button
              basic
              content={this.translate('edit_multipliers_button')}
            />}
          onSubmit={this.editTaskObjectivesSubmit}
          onOpen={this.loadDetails}
          onClose={this.collapse}
        >
          <Modal.Content>
            <Form onSubmit={this.editTaskObjectivesSubmit} loading={this.state.loading}>
              <Container className="header" textAlign="right">
                <Button.Group size="large">
                  <Button
                    type="button"
                    onClick={() => this.setState({ detailed: false })}
                    content={this.translate('all')}
                    color={this.state.detailed ? undefined : 'blue'}
                  />
                  <Button.Or text={this.translate('or')} />
                  <Button
                    type="button"
                    onClick={() => this.setState({ detailed: true })}
                    content={this.translate('detailed')}
                    color={this.state.detailed ? 'blue' : undefined}
                  />
                </Button.Group>
              </Container>
              {this.state.detailed ? (
                this.props.objectives.map(objective => (this.state.values[objective.id] ? (
                  <ChangeObjectiveMultiplier
                    key={objective.id}
                    objective={objective}
                    values={this.state.values}
                    loading={this.state.loading}
                    changeModified={this.changeModified}
                    changeMultiplier={this.changeMultiplier}
                    defaultText={this.translate('default')}
                    orText={this.translate('or')}
                    modifyText={this.translate('modify')}
                  />) : null
                ))
              ) : (
                <ChangeAllObjectivesMultipliers
                  defaultMultiplier={this.state.values[0]}
                  defaultInd={0}
                  changeMultiplier={this.changeMultiplier}
                  changeModified={this.changeModified}
                  allText={this.translate('all')}
                  defaultText={this.translate('default')}
                  modifyText={this.translate('modify')}
                  orText={this.translate('or')}
                />
              )}
              <Button type="submit" color="green" style={{ margin: '0px 15px 0px 15px' }}>{this.translate('save')}</Button>
              <Button type="cancel" style={{ margin: '0px 15px 0px 15px' }} onClick={this.collapse}>{this.translate('cancel')}</Button>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

EditTaskObjectivesForm.propTypes = {
  taskId: PropTypes.number.isRequired,
  editTaskObjectives: PropTypes.func.isRequired,
  objectives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    multiplier: PropTypes.number.isRequired
  })).isRequired,
  defaultMultiplier: PropTypes.number.isRequired,
  objectivesDetails: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const taskObjectives = state.task.tasks
    .find(task => task.id === ownProps.taskId).objectives
    .reduce(
      (acc, curr) => ({ ...acc, [curr.id]: { multiplier: curr.multiplier } }),
      {}
    )
  const objectives = state.category.categories
    .reduce(
      (acc, curr) => acc.concat(curr.skill_levels.reduce(
        (acc2, curr2) => acc2.concat(curr2.objectives
          .filter(objective => taskObjectives[objective.id]).map(objective => ({
            ...objective,
            multiplier: taskObjectives[objective.id].multiplier
          }))),
        []
      )),
      []
    )
  return {
    taskId: ownProps.taskId,
    objectives,
    defaultMultiplier: state.task.tasks.find(task => task.id === ownProps.taskId).types
      .reduce((acc, typeId) => (
        acc * state.type.headers.reduce((multiplier, header) => {
          const type = header.types.find(htype => htype.id === typeId)
          if (!type) return multiplier
          return type.multiplier
        }, 0)
      ), 1)
  }
}

const mapDispatchToProps = dispatch => ({
  editTaskObjectives: asyncAction(editTaskObjectives, dispatch),
  objectivesDetails
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(EditTaskObjectivesForm))
