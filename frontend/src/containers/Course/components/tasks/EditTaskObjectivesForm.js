import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Form, Input, Label, Container } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { objectivesDetails } from '../../../../api/tasks'
import { editTaskObjectives } from '../../actions/tasks'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'

class EditTaskObjectivesForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detailed: true,
      triggered: false,
      loading: true,
      values: {
        0: {
          multiplier: this.props.defaultMultiplier,
          modified: false
        }
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

  editTaskObjectivesSubmit = () => {
    this.props.editTaskObjectives({
      task_id: this.props.taskId,
      objectives: this.props.objectives.map(objective => ({
        ...(this.state.detailed ? this.state.values[objective.id] : this.state.values[0]),
        id: objective.id
      })).filter(objective => objective.modified !== null)
    })
    this.setState({
      loading: true,
      triggered: false
    })
  }

  loadDetails = async () => {
    if (this.state.triggered) return
    this.setState({
      triggered: true
    })
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

  translate = id => this.props.translate(`Course.tasks.EditTaskObjectivesForm.${id}`)

  render() {
    return (
      <div className="EditTaskObjectivesForm" style={{ display: 'none' }}>
        <ModalForm
          expanded={this.props.expanded}
          header={this.translate('header')}
          trigger={<div />}
          actions={saveActions(this.translate)}
          onSubmit={this.editTaskObjectivesSubmit}
          onClose={this.props.onClose}
          onOpen={this.loadDetails}
          loading={this.state.loading}
        >
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
              <Form.Field key={objective.id}>
                <Container>
                  <Label basic size="large">{objective.name}</Label>
                </Container>
                <Container>
                  <Button.Group size="small">
                    <Button
                      type="button"
                      content={this.translate('default')}
                      color={this.state.loading || this.state.values[objective.id].modified ? undefined : 'blue'}
                      onClick={this.changeModified(objective.id, false)}
                    />
                    <Button.Or text={this.translate('or')} />
                    <Button
                      type="button"
                      content={this.translate('modify')}
                      color={!this.state.loading && this.state.values[objective.id].modified ? 'blue' : undefined}
                      onClick={this.changeModified(objective.id, true)}
                    />
                  </Button.Group>
                  <Input
                    className="multiplierInput"
                    value={this.state.loading ? 0 : this.state.values[objective.id].multiplier}
                    onChange={this.changeMultiplier(objective.id)}
                    name={`objective ${objective.id}`}
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    disabled={this.state.loading || !this.state.values[objective.id].modified}
                  />
                </Container>
              </Form.Field>) : null
            ))
          ) : (
            <Form.Field>
              <Container>
                <Label basic size="large">{this.translate('all')}</Label>
              </Container>
              <Container>
                <Button.Group size="small">
                  <Button
                    type="button"
                    content={this.translate('default')}
                    color={Object.values(this.state.values)[0].modified === false ? 'blue' : undefined}
                    onClick={this.changeModified(0, false)}
                  />
                  <Button.Or text={this.translate('or')} />
                  <Button
                    type="button"
                    content={this.translate('modify')}
                    color={Object.values(this.state.values)[0].modified === true ? 'blue' : undefined}
                    onClick={this.changeModified(0, true)}
                  />
                </Button.Group>
                <Input
                  className="multiplierInput"
                  value={Object.values(this.state.values)[0].multiplier}
                  onChange={this.changeMultiplier(0)}
                  name="all"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  disabled={!Object.values(this.state.values)[0].modified}
                />
              </Container>
            </Form.Field>
          )}
        </ModalForm>
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
  expanded: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
    expanded: ownProps.expanded,
    onClose: ownProps.onClose,
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
