import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Input, Segment, Header } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeType } from '../../services/types'
import { changeTypeMultiplier } from '../../actions/types'

import DeleteForm from '../../../../utils/components/DeleteForm'

export class Type extends Component {
  changeMultiplier = (e) => {
    this.props.changeTypeMultiplier({
      id: this.props.type.id,
      multiplier: Number(e.target.value)
    })
  }

  render() {
    return (
      <Segment className="Type">
        <div className="headerBlock">
          <Header className="typeHeader">{this.props.type.name}</Header>
        </div>
        {this.props.editing ? (
          <div className="removeBlock">
            <DeleteForm
              onExecute={() => this.props.removeType({ id: this.props.type.id })}
              prompt={[
                'Poistetaanko tyyppi',
                `"${this.props.type.name}"`
              ]}
              header="Poista tyyppi"
            />
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
  editing: PropTypes.bool.isRequired,
  changeTypeMultiplier: PropTypes.func.isRequired,
  removeType: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  changeTypeMultiplier: changeTypeMultiplier(dispatch),
  removeType: asyncAction(removeType, dispatch)
})

export default connect(null, mapDispatchToProps)(Type)
