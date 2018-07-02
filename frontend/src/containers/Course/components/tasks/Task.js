import React, { Component } from 'react'
import { Grid, Button } from 'semantic-ui-react'
import './tasks.css'

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
    return (
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <h3>{this.props.task.name}</h3>
            <h4>{this.props.task.description}</h4>
            <p>{this.props.task.info}</p>
          </Grid.Column>
        </Grid.Row>
          {this.props.taskSkills.map(skill => (
            <Grid.Row key={skill}>
              <Grid.Column textAlign="right">
                <h3>{skill}</h3>
                <input type="range" min={0} max={1} step={0.01} defaultValue={0.8} />
              </Grid.Column>
            </Grid.Row>
          ))}
      </Grid>
    )
  }

  render() {
    return (
      <div className="task">
        <Button onClick={this.toggleExpanded} basic={!this.state.expanded} color="green" fluid>{this.props.task.name}</Button>
        {this.renderExpanded()}
      </div>
    )
  }
}

export default Task