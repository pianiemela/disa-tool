import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeType } from '../../actions/types'
import { addTypeToTask, removeTypeFromTask } from '../../actions/tasks'

import DeleteForm from '../../../../utils/components/DeleteForm'

export class Type extends Component {
  toggleType = () => {
    if (this.props.activeTaskId) {
      this.props.toggleType({
        type_id: this.props.type.id,
        task_id: this.props.activeTaskId
      })
    }
  }

  render() {
    return (
      <Segment
        className="Type"
        style={{
            cursor: this.props.activeTaskId === null ? 'default' : 'pointer',
            backgroundColor: this.props.active ? '#21ba45' : undefined
          }}
        onClick={this.toggleType}
      >
        <div className="headerBlock">
          <Header className="typeHeader">{this.props.type.name}</Header>
        </div>
        <div className="multiplierBlock">
          <Label size="large" >{this.props.type.multiplier}</Label>
        </div>
        {this.props.editing ? (
          <div>
            <div className="editBlock">
              <Button type="button" icon={{ name: 'edit', size: 'small' }} />
            </div>
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
          </div>
        ) : (
          null
        )}
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
  removeType: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  activeTaskId: PropTypes.number,
  toggleType: PropTypes.func.isRequired
}

Type.defaultProps = {
  activeTaskId: null
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  removeType: asyncAction(removeType, dispatch),
  toggleType: asyncAction(ownProps.active ? removeTypeFromTask : addTypeToTask, dispatch)
})

export default connect(null, mapDispatchToProps)(Type)
