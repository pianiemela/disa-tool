import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Grid, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addObjectiveToTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

export class AddObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      objectiveSelection: undefined
    }
  }

  shouldComponentUpdate(newProps, newState) {
    return newState.options.length > 0
  }

  prepareOptions = () => {
    let options = []
    const excluded = {}
    this.props.objectiveIds.forEach((id) => {
      excluded[id] = true
    })
    options = this.props.objectives
      .filter(objective => !excluded[objective.id])
      .map(objective => ({
        key: objective.id,
        value: objective.id,
        text: objective.name
      }))
    if (options === []) {
      options.push({
        text: '<CannotAddMore>',
        value: null
      })
    }
    this.setState({
      options
    })
  }

  changeObjectiveSelection = (e, { value }) => {
    this.setState({
      objectiveSelection: value
    })
  }

  addObjectiveSubmit = (e) => {
    e.preventDefault()
    this.props.addObjectiveToTask({
      taskId: this.props.task.id,
      objectiveId: this.state.objectiveSelection
    })
  }

  render() {
    const contentPrompt = [
      'Liitä oppimistavoite tehtävään',
      `"${this.props.task.name}"`
    ].join(' ')
    const label = 'oppimistavoite'
    return (
      <Grid.Row>
        <Grid.Column textAlign="right">
          <div className="AddObjectiveForm">
            <ModalForm
              header="Liitä oppimistavoite tehtävään"
              trigger={<Button className="addObjectiveToTaskButton" icon={{ name: 'add' }} onClick={this.prepareOptions} />}
              content={
                <div>
                  <p>
                    {contentPrompt}.
                  </p>
                  <Form.Field>
                    <Label>{label}</Label>
                    <Dropdown
                      name="objective"
                      className="objectiveDropdown"
                      options={this.state.options}
                      selection
                      value={this.state.objectiveSelection}
                      onChange={this.changeObjectiveSelection}
                      fluid
                    />
                  </Form.Field>
                  <Button type="submit" color="green">Tallenna</Button>
                </div>
              }
              onSubmit={this.addObjectiveSubmit}
            />
          </div>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

AddObjectiveForm.propTypes = {
  objectiveIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  objectives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired
  })).isRequired,
  addObjectiveToTask: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => (
  {
    ...ownProps,
    objectives: state.objective.objectives
  }
)

const mapDispatchToProps = dispatch => ({
  addObjectiveToTask: asyncAction(addObjectiveToTask, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AddObjectiveForm)
