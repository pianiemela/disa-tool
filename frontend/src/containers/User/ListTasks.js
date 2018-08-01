import React from 'react'
import { Icon, Label, List } from 'semantic-ui-react'


export const ListTasks = ({ tasks, selectedType }) => (
  <div>
    <p>Tehtävät</p>
    <p><Icon name="checkmark" color="green" /> tehty, <Icon name="delete" color="red" /> ei tehty</p>
    <List divided size="tiny">
      {tasks.map(task => (
        <List.Item key={task.id}>
          {task.task_responses.length > 0 ?
            <List.Icon verticalAlign="middle" name="checkmark" color="green" /> :
            <List.Icon verticalAlign="middle" name="delete" color="red" />}
          <List.Content>
            {task.name} {task.types.map(type => (
              <Label
                basic={!selectedType || type.id !== selectedType.id}
                size="mini"
                key={type.id}
                color={selectedType && type.id === selectedType.id ?
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
export default ListTasks
