import React, { Component } from 'react'
import { Input, Segment, Header} from 'semantic-ui-react'

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
        <div className="inputBlock">
          <div className="inputContainer">
            <Input className="numberInput" type="number" min={0} max={1} step={0.01} value={this.state.multiplier} onChange={this.changeMultiplier} />
            <Input className="rangeInput" type="range" min={0} max={1} step={0.01} value={this.state.multiplier} onChange={this.changeMultiplier} />
          </div>
        </div>
        {/* TODO: create button for removing type. */}
      </Segment>
    )
  }
}

export default Type