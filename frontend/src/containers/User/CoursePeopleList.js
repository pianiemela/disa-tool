import React from 'react'
import { shape, arrayOf } from 'prop-types'
import { List, Label, Button, Icon, Table } from 'semantic-ui-react'

const getTasksForType = (tasks, typeId) => (
  tasks.filter(task => task.types.find(type => type.id === typeId))
)

export const CoursePeopleList = ({ students, types, tasks, selectType, selectedType }) => {
  if (!selectedType) {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan="2">Opiskelija</Table.HeaderCell>
            {types.map(header => <Table.HeaderCell colSpan={`${header.types.length}`}>{header.name}</Table.HeaderCell>)}
          </Table.Row>
          <Table.Row>
            {types.map(header => header.types.map(type => <Table.HeaderCell><Button onClick={selectType} type={type}>{type.name}</Button></Table.HeaderCell>))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {students.map(person => (
            <Table.Row>
              <Table.Cell>
                {person.studentnumber} - {person.name}
              </Table.Cell>
              {types.map(header => header.types.map(type => (
                <Table.Cell>
                  {person.task_responses.filter(response =>
                getTasksForType(tasks, type.id).find(t => t.task_type.task_id === response.task_id))
                .length} / {getTasksForType(tasks, type.id).length}
                </Table.Cell>
          )))}
            </Table.Row>
        ))}
        </Table.Body>
      </Table>
    )
  }
  const selectedTasks = tasks.filter(task => task.types.find(type => type.id === selectedType.id))
  return (
    <Table compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan="2">Opiskelija</Table.HeaderCell>
          <Table.HeaderCell><Button onClick={selectType} type={selectedType}>{selectedType.name}</Button></Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          {selectedTasks.map(task => <Table.HeaderCell>{task.name}</Table.HeaderCell>)}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {students.map(person => (
          <Table.Row>
            <Table.Cell>
              {person.studentnumber} - {person.name}
            </Table.Cell>
            {selectedTasks.map(task => (
              person.task_responses.find(response => response.task_id === task.id) ?
                <Table.Cell>
                  <span>{person.task_responses.find(response => response.task_id === task.id).points}</span>
                </Table.Cell> :
                <Table.Cell selectable textAlign="center">
                  <Button basic size="tiny" icon="edit" color="blue" />
                </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

CoursePeopleList.propTypes = {
  students: arrayOf(shape()).isRequired
}

export default CoursePeopleList
