import React, { Component } from 'react'
import { Grid, Button } from 'semantic-ui-react'
import './tasks.css'

import ObjectiveSlider from './ObjectiveSlider'
import AddObjectiveForm from './AddObjectiveForm'

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  toggleExpanded = e => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  renderExpanded() {
    if (!this.state.expanded) {
      return <div />
    }
    const excludedObjectives = []
    return (
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <h3>{this.props.task.name}</h3>
            <h4>{this.props.task.description}</h4>
            <p>{this.props.task.info}</p>
          </Grid.Column>
        </Grid.Row>
        {this.props.task.objectives.map(objective => (
          <ObjectiveSlider key={objective.name} objective={objective} />
        ))}
        {this.props.editing ? (<AddObjectiveForm objectives={excludedObjectives} task={this.props.task.id} />) : (<div />)}
      </Grid>
    )
  }

  render() {
    return (
      <div className="task">
        <Button onClick={this.toggleExpanded} basic={!this.state.expanded} fluid>{this.props.task.name}</Button>
        {this.renderExpanded()}
      </div>
    )
  }
}

export default Task