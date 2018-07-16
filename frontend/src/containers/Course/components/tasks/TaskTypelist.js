import React from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'

import TaskType from './TaskType'
import AddTypeForm from './AddTypeForm'

const TaskTypelist = props => (
  <div className="TaskTypelist">
    <Header>Tyypit</Header>
    <div className="TaskTypelistContainer">
      {props.types.length > 0 ? props.types.map(type => (
        <TaskType key={type.id} type={type} task={props.task} editing={props.editing} />
      )) : 'Ei tyyppejä'}
      {props.editing ? (
        <AddTypeForm task={props.task} typeIds={props.types.map(type => type.id)} />
      ) : (
        <div />
      )}
    </div>
  </div>
)

TaskTypelist.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }).isRequired,
  editing: PropTypes.bool.isRequired
}

export default TaskTypelist
