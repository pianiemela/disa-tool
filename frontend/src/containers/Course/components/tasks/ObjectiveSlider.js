import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Input } from 'semantic-ui-react'
import './tasks.css'

import { changeTaskObjectiveMultiplier } from '../../actions/tasks'

class ObjectiveSlider extends Component {
  changeValue = e => {
    this.props.changeTaskObjectiveMultiplier({
      taskId: this.props.taskId,
      objectiveId: this.props.objective.id,
      multiplier: Number(e.target.value)
    })
  }

  render() {
    return (
      <Grid.Row className="objectiveSlider">
        <Grid.Column textAlign="right">
          <h3>{this.props.objective.name}</h3>
          <Input className="numberInput" type="number" min={0} max={1} step={0.01} value={this.props.objective.multiplier} onChange={this.changeValue} />
          <Input className="RangeInput" type="range" min={0} max={1} step={0.01} value={this.props.objective.multiplier} onChange={this.changeValue} />
        </Grid.Column>
      </Grid.Row>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTaskObjectiveMultiplier: changeTaskObjectiveMultiplier(dispatch)
  }
}

export default connect(null, mapDispatchToProps)(ObjectiveSlider)