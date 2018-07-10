import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Input } from 'semantic-ui-react'

import { changeTaskObjectiveMultiplier } from '../../actions/tasks'

export class ObjectiveSlider extends Component {
  changeValue = (e) => {
    this.props.changeTaskObjectiveMultiplier({
      taskId: this.props.taskId,
      objectiveId: this.props.objective.id,
      multiplier: Number(e.target.value)
    })
  }

  render() {
    return (
      <div className="ObjectiveSlider">
        <h3>{this.props.objective.name}</h3>
        <Input className="numberInput" type="number" min={0} max={1} step={0.01} value={this.props.objective.multiplier} onChange={this.changeValue} />
        <Input className="RangeInput" type="range" min={0} max={1} step={0.01} value={this.props.objective.multiplier} onChange={this.changeValue} />
      </div>
    )
  }
}

ObjectiveSlider.propTypes = {
  taskId: PropTypes.number.isRequired,
  objective: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    multiplier: PropTypes.number.isRequired
  }).isRequired,
  changeTaskObjectiveMultiplier: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  changeTaskObjectiveMultiplier: changeTaskObjectiveMultiplier(dispatch)
})

export default connect(null, mapDispatchToProps)(ObjectiveSlider)
