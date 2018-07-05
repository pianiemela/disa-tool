import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Grid, Modal, Label } from 'semantic-ui-react'
import './tasks.css'

import { addObjectiveToTask } from '../../services/tasks'

class AddObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      objectiveSelection: undefined
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.expanded || nextState.expanded
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
    this.setState({
      expanded: false
    })
  }

  render() {
    let options = []
    if (this.state.expanded) {
      const excluded = {}
      this.props.objectiveIds.forEach((id) => {
        excluded[id] = true
      })
      options = this.props.objectives.filter(objective => !excluded[objective.id]).map(objective => ({
        value: objective.id,
        text: objective.name
      }))
    }
    return (
      <Grid.Row>
        <Grid.Column textAlign="right">
          <div className="addObjectiveForm">
            <Modal
              trigger={<Button onClick={this.expand} icon={{ name: 'add' }} />}
              open={this.state.expanded}
              onClose={this.collapse}
            >
              <Modal.Header>placeholder data</Modal.Header>
              <Modal.Content>
                <Form onSubmit={this.addObjectiveSubmit}>
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
                </Form>
              </Modal.Content>
            </Modal>
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
