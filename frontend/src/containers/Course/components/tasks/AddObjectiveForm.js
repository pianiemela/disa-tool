import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Grid, Label } from 'semantic-ui-react'
import './tasks.css'

import { addObjectiveToTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class AddObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      objectiveSelection: undefined
    }
    this.header = 'placeholder content'
    this.trigger = (
      <Button icon={{ name: 'add' }} />
    )
  }

  changeObjectiveSelection = (e, { value }) => {
    this.setState({
      objectiveSelection: value
    })
  }

  addObjectiveSubmit = (e) => {
    e.preventDefault()
    addObjectiveToTask({
      taskId: this.props.taskId,
      objectiveId: this.state.objectiveSelection
    }).then((response) => {
      console.log(response)
    })
  }

  render() {
    let options = []
    const excluded = {}
    this.props.objectiveIds.forEach((id) => {
      excluded[id] = true
    })
    options = this.props.objectives
      .filter(objective => !excluded[objective.id])
      .map(objective => ({
        value: objective.id,
        text: objective.name
      }))
    return (
      <Grid.Row>
        <Grid.Column textAlign="right">
          <div className="addObjectiveForm">
            <ModalForm
              header={this.header}
              trigger={this.trigger}
              content={
                <div>
                  <Form.Field>
                    <Label>objective</Label>
                    <Dropdown
                      name="objective"
                      className="objectiveDropdown"
                      options={options}
                      selection
                      value={this.state.objectiveSelection}
                      onChange={this.changeObjectiveSelection}
                    />
                  </Form.Field>
                  <Button type="submit">Tallenna</Button>
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
  taskId: PropTypes.number.isRequired,
  objectives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired
  })).isRequired
}

const mapStateToProps = (state, ownProps) => (
  {
    ...ownProps,
    objectives: state.objective.objectives
  }
)

export default connect(mapStateToProps, null)(AddObjectiveForm)
