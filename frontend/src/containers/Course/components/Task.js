import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

class Task extends Component {
  constructor(props) {
    super(props)
  }

  render() {
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
}

export default Task