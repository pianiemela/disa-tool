import React, { Component } from 'react'
import { Form, Button, Dropdown, Grid } from 'semantic-ui-react'
import './tasks.css'

import { addObjectiveToTask } from '../../services/tasks.js'

class AddObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      objectiveSelection: undefined
    }
  }

  toggleExpanded = e => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  changeObjectiveSelection = (e, {value}) => {
    this.setState({
      objectiveSelection: value
    })
  }

  addObjectiveSubmit = e => {
    e.preventDefault()
    addObjectiveToTask({
      taskId: this.props.task,
      objectiveId: this.state.objectiveSelection
    }).then(response => {
      console.log(response)
    })
    this.setState({
      expanded: false
    })
  }

  renderContent() {
    if (this.state.expanded) {
      const options = this.props.objectives.map(objective => {
        return {
          value: objective.id,
          text: objective.name
        }
      })
      return (
        <div>
          <Button icon={{ name: 'window minimize', size: 'large' }} type="button" onClick={this.toggleExpanded} />
          <div className="expandedContent">
            <Form.Field>
              <Button type="submit" icon={{ name:"add", color:"green" }} />
              <Dropdown name="objective" className="objectiveDropdown" options={options} selection value={this.state.objectiveSelection} onChange={this.changeObjectiveSelection} />
            </Form.Field>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Button icon={{ name: 'add', size: 'large' }} type="button" onClick={this.toggleExpanded} />
        </div>
      )
    }
  }

  render() {
    return (
      <Grid.Row>
        <Grid.Column textAlign="right">
          <Form className="addObjectiveForm" onSubmit={this.addObjectiveSubmit}>
            {this.renderContent()}
          </Form>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

export default AddObjectiveForm