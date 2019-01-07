import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Segment, Header, Label } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import { removeType, editType } from '../../actions/types'
import { addTypeToTask, removeTypeFromTask } from '../../actions/tasks'
import DeleteForm from '../../../../utils/components/DeleteForm'
import EditTypeForm from './EditTypeForm'
import dndItem, { defaults } from '../../../../utils/components/DnDItem'

export const dropSpec = {
  ...defaults.dropSpec,
  drop: (props, monitor) => {
    const drag = monitor.getItem()
    const { slots, element } = props
    let slot
    if (drag.type_header_id === element.type_header_id) {
      if (drag.order === element.order) {
        slot = drag.order
      } else if (drag.order > element.order) {
        slot = slots.previous
      } else {
        slot = slots.next
      }
    } else {
      slot = slots ? slots.previous : element.order
    }
    props.mover({
      id: drag.id,
      order: slot,
      type_header_id: element.type_header_id
    }, true)
  }
}

const DnDItem = dndItem('type', {
  dropSpec,
  dragSpec: {
    ...defaults.dragSpec,
    beginDrag: props => ({
      ...defaults.dragSpec.beginDrag(props),
      type_header_id: props.element.type_header_id
    })
  }
})

export class Type extends Component {
  toggleType = () => {
    if (this.props.activeTaskId) {
      this.props.toggleType({
        type_id: this.props.type.id,
        task_id: this.props.activeTaskId
      })
    }
  }

  translate = id => this.props.translate(`Course.types.Type.${id}`)

  render() {
    const {
      activeTaskId,
      active,
      type,
      slots,
      moveType,
      headerId
    } = this.props
    const content = (
      <Segment
        className="Type"
        style={{
            cursor: activeTaskId === null ? undefined : 'pointer',
            backgroundColor: active ? '#21ba45' : undefined
          }}
        onClick={this.toggleType}
      >
        <div className="headerBlock">
          <Header className="typeHeader">{type.name}</Header>
        </div>
        <div className="multiplierBlock">
          <Label size="large" >{type.multiplier.toFixed(2)}</Label>
        </div>
        {this.props.editing ? (
          <div>
            <div className="editBlock">
              <EditTypeForm typeId={type.id} />
            </div>
            <div className="removeBlock">
              <DeleteForm
                onExecute={() => this.props.removeType({ id: type.id })}
                prompt={[
                  this.translate('delete_prompt_1'),
                  `"${type.name}"`
                ]}
                header={this.translate('delete_header')}
              />
            </div>
          </div>
        ) : (
          null
        )}
      </Segment>
    )
    if (this.props.editing) {
      return (
        <DnDItem
          element={{
            ...type,
            type_header_id: headerId
          }}
          slots={slots}
          mover={moveType}
        >
          {content}
        </DnDItem>
      )
    }
    return content
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
  toggleType: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  moveType: PropTypes.func.isRequired,
  slots: PropTypes.shape({
    previous: PropTypes.number.isRequired,
    next: PropTypes.number.isRequired
  }).isRequired,
  headerId: PropTypes.number.isRequired
}

Type.defaultProps = {
  activeTaskId: null
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  removeType: asyncAction(removeType, dispatch),
  toggleType: asyncAction(ownProps.active ? removeTypeFromTask : addTypeToTask, dispatch),
  moveType: asyncAction(editType, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(Type))
