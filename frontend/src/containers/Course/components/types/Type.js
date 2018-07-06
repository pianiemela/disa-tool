import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
            <RemoveTypeForm type={this.props.type} />
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

Type.propTypes = {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    multiplier: PropTypes.number
  }).isRequired,
  editing: PropTypes.bool,
  changeTypeMultiplier: PropTypes.func.isRequired
}

Type.defaultProps = {
  editing: false
}

const mapDispatchToProps = dispatch => ({
  changeTypeMultiplier: changeTypeMultiplier(dispatch)
})

export default connect(null, mapDispatchToProps)(Type)
