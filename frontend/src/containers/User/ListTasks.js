import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Label, List } from 'semantic-ui-react'

const typeSorter = (a, b) => {
  if (a.type_header.order === b.type_header.order) {
    return a.order - b.order
  }
  return a.type_header.order - b.type_header.order
}

export const ListTasks = props => (
  <div>
    <p><Icon name="checkmark" color="green" /> tehty, <Icon name="delete" color="red" /> ei tehty</p>
    <List divided size="tiny">
      {props.tasks.map(task => (
        <List.Item key={task.id}>
          {task.task_responses.length > 0 ?
            <List.Icon verticalAlign="middle" name="checkmark" color="green" /> :
            <List.Icon verticalAlign="middle" name="delete" color="red" />}
          <List.Content>
            {task.name} {task.types.sort(typeSorter).map(type => (
              <Label
                basic={!props.selectedType || type.id !== props.selectedType.id}
                size="mini"
                key={type.id}
                color={props.selectedType && type.id === props.selectedType.id ?
                  'green' : undefined}
              >
                {type.header} {type.name}
              </Label>))}
          </List.Content>
        </List.Item>
              ))}
    </List>
  </div>
)

ListTasks.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    task_responses: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      header: PropTypes.string,
      name: PropTypes.string
    })).isRequired
  })).isRequired
}

export default ListTasks
