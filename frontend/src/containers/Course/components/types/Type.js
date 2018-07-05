import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Segment, Header } from 'semantic-ui-react'

import { changeTypeMultiplier } from '../../actions/types'

import RemoveTypeForm from './RemoveTypeForm'

class Type extends Component {
  changeMultiplier = (e) => {
    this.props.changeTypeMultiplier({
      id: this.props.type.id,
      multiplier: Number(e.target.value)
    })
  }

  render() {
    return (
      <Segment className="type">
        <div className="headerBlock">
          <Header className="typeHeader">{this.props.type.name}</Header>
        </div>
        {this.props.editing ? (
          <div className="removeBlock">
            <RemoveTypeForm id={this.props.type.id} />
          </div>
        ) : (
          <div />
        )}
        <div className="inputBlock">
          <div className="inputContainer">
            <Input className="numberInput" type="number" min={0} max={1} step={0.01} value={this.props.type.multiplier} onChange={this.changeMultiplier} />
            <Input className="rangeInput" type="range" min={0} max={1} step={0.01} value={this.props.type.multiplier} onChange={this.changeMultiplier} />
          </div>
        </div>
      </Segment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  changeTypeMultiplier: changeTypeMultiplier(dispatch)
})

export default connect(null, mapDispatchToProps)(Type)
