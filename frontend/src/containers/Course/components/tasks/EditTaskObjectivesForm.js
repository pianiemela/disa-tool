import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input, Label, Container } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { editTaskObjectives } from '../../actions/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class EditTaskObjectivesForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: this.props.objectives.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id]: {
            multiplier: curr.multiplier,
            modified: null
          }
        }),
        {}
      )
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.taskId !== this.props.taskId) {
      this.setState({
        values: newProps.objectives.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.id]: {
              multiplier: curr.multiplier,
              modified: null
            }
          }),
          {}
        )
      })
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
        multiplier: modified === false ? this.props.defaultMultiplier : this.state.values[id].multiplier,
        modified
      }
    }
  })

  editTaskObjectivesSubmit = () => this.props.editTaskObjectives({
    task_id: this.props.taskId,
    objectives: this.props.objectives.map(objective => ({
      ...this.state.values[objective.id],
      id: objective.id
    })).filter(objective => objective.modified !== null)
  })

  render() {
    return (
      <div className="EditTaskObjectivesForm">
        <ModalForm
          header="Muokkaa kertoimia"
          trigger={<Button icon={{ name: 'edit' }} />}
          content={
            <div>
              {this.props.objectives.map(objective => (
                <Form.Field key={objective.id}>
                  <Container>
                    <Label basic>{objective.name}</Label>
                  </Container>
                  <Container>
                    <Button.Group size="small">
                      <Button
                        type="button"
                        content="Pidä ennallaan"
                        toggle
                        active={this.state.values[objective.id].modified === null}
                        onClick={this.changeModified(objective.id, null)}
                      />
                      <Button.Or text="tai" />
                      <Button
                        type="button"
                        content="Palauta oletusarvoon"
                        toggle
                        active={this.state.values[objective.id].modified === false}
                        onClick={this.changeModified(objective.id, false)}
                      />
                      <Button.Or text="tai" />
                      <Button
                        type="button"
                        content="Muuta"
                        toggle
                        active={this.state.values[objective.id].modified === true}
                        onClick={this.changeModified(objective.id, true)}
                      />
                    </Button.Group>
                    <Input
                      value={this.state.values[objective.id].multiplier}
                      onChange={this.changeMultiplier(objective.id)}
                      name={`objective ${objective.id}`}
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      disabled={!this.state.values[objective.id].modified}
                      style={{ width: '100px' }}
                    />
                  </Container>
                </Form.Field>
              ))}
              <Button color="blue">Tallenna</Button>
            </div>
          }
          onSubmit={this.editTaskObjectivesSubmit}
        />
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
  defaultMultiplier: PropTypes.number.isRequired
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
    defaultMultiplier: state.task.tasks.find(task => task.id === ownProps.taskId).defaultMultiplier
  }
}

const mapDispatchToProps = dispatch => ({
  editTaskObjectives: asyncAction(editTaskObjectives, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTaskObjectivesForm)
