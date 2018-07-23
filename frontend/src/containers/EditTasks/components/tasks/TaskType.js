import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeTypeFromTask } from '../../services/tasks'

import DeleteForm from '../../../../utils/components/DeleteForm'

export const TaskType = props => (
  <div className="TaskType">
    <Segment className="TaskTypeContainer">
      <span className="TaskTypeName">
        {props.type.name}
      </span>
      {props.editing ? (
        <DeleteForm
          onExecute={() => props.removeTypeFromTask({
            taskId: props.task.id,
            typeId: props.type.id
          })}
          prompt={[
            'Poistetaanko tyyppi',
            `"${props.type.name}"`,
            'tehtävästä',
            `"${props.task.name}"`
          ]}
          header="Poista tyyppi tehtävästä"
        />
      ) : (
        <div />
      )}
    </Segment>
  </div>
)

TaskType.propTypes = {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeTypeFromTask: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeTypeFromTask: asyncAction(removeTypeFromTask, dispatch)
})

export default connect(null, mapDispatchToProps)(TaskType)
