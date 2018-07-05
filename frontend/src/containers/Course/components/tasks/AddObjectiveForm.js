import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Grid, Label } from 'semantic-ui-react'

import { addObjectiveToTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class AddObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      objectiveSelection: undefined
    }
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
    addObjectiveToTask({
      taskId: this.props.taskId,
      objectiveId: this.state.objectiveSelection
    }).then((response) => {
      console.log(response)
    })
  }

  render() {
    return (
      <Grid.Row>
        <Grid.Column textAlign="right">
          <div className="addObjectiveForm">
            <ModalForm
              header="placeholder content"
              trigger={<Button icon={{ name: 'add' }} onClick={this.prepareOptions} />}
              content={
                <div>
                  <Form.Field>
                    <Label>objective</Label>
                    <Dropdown
                      name="objective"
                      className="objectiveDropdown"
                      options={this.state.options}
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
