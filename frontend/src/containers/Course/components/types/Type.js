import React, { Component } from 'react'
import { Input, Segment, Header, Button } from 'semantic-ui-react'

import RemoveTypeForm from './RemoveTypeForm'
import AddTypeForm from './AddTypeForm'

class Type extends Component {
  constructor(props) {
    super(props)
    this.state = {
      multiplier: 0.8
    }
  }

  changeMultiplier = e => {
    this.setState({
      multiplier: e.target.value
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
            <Input className="numberInput" type="number" min={0} max={1} step={0.01} value={this.state.multiplier} onChange={this.changeMultiplier} />
            <Input className="rangeInput" type="range" min={0} max={1} step={0.01} value={this.state.multiplier} onChange={this.changeMultiplier} />
          </div>
        </div>
      </Segment>
    )
  }
}

export default Type