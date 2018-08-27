import React from 'react'
import { Button, Table } from 'semantic-ui-react'

const getTasksForType = (tasks, typeId) => (
  tasks.filter(task => task.types.find(type => type.id === typeId))
)

const TaskResponseTypeTable = ({ types, students, tasks, selectType }) => (
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell rowSpan="2">Opiskelija</Table.HeaderCell>
        {types.map(header => <Table.HeaderCell key={header.id} colSpan={`${header.types.length}`}>{header.name}</Table.HeaderCell>)}
      </Table.Row>
      <Table.Row>
        {types.map(header => header.types.map(type => <Table.HeaderCell key={type.id}><Button onClick={selectType} type={type} color={type.updated ? 'red' : 'grey'}>{type.name}</Button></Table.HeaderCell>))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {students.map(person => (
        <Table.Row key={person.id}>
          <Table.Cell>
            {person.studentnumber} - {person.name}
          </Table.Cell>
          {types.map(header => header.types.map(type => (
            <Table.Cell key={type.id}>
              {person.task_responses.filter(response =>
            getTasksForType(tasks, type.id).find(t => t.id === response.task_id))
            .length} / {getTasksForType(tasks, type.id).length}
            </Table.Cell>
      )))}
        </Table.Row>
    ))}
    </Table.Body>
  </Table>
)

export default TaskResponseTypeTable
