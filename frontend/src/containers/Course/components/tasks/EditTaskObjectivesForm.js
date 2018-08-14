import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { editTaskObjectives } from '../../actions/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class EditTaskObjectivesForm extends Component {
  editTaskObjectivesSubmit = e => this.props.editTaskObjectives({
    task_id: this.props.taskId,
    objectives: this.props.objectives.map(objective => ({
      id: objective.id,
      multiplier: e.target[`objective ${objective.id}`].value
    }))
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
                  <Label>{objective.name}</Label>
                  <Input name={`objective ${objective.id}`} type="number" min={0} max={1} step={0.01} />
                </Form.Field>
              ))}
              <Button color="green">Tallenna</Button>
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
  })).isRequired
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
    objectives
  }
}

const mapDispatchToProps = dispatch => ({
  editTaskObjectives: asyncAction(editTaskObjectives, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTaskObjectivesForm)
