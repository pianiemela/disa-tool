import React, { Component } from 'react'
import { Grid, Input } from 'semantic-ui-react'
import './tasks.css'

class ObjectiveSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0.8
    }
  }

  changeValue = e => {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    return (
      <Grid.Row className="objectiveSlider">
        <Grid.Column textAlign="right">
          <h3>{this.props.objective.name}</h3>
          <Input className="numberInput" type="number" min={0} max={1} step={0.01} value={this.state.value} onChange={this.changeValue} />
          <Input className="RangeInput" type="range" min={0} max={1} step={0.01} value={this.state.value} onChange={this.changeValue} />
        </Grid.Column>
      </Grid.Row>
    )
  }
}

export default ObjectiveSlider