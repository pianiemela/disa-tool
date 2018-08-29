import React from 'react'
import { Button, Table } from 'semantic-ui-react'

import TaskUpdatePopup from './components/TaskUpdatePopup'

const TaskResponseEditTable = ({
  selectedTasks,
  studentTasks,
  selectType,
  selectedType,
  markTask,
  updateTask,
  popUp
}) => (
  <Table compact>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell rowSpan="2">Opiskelija</Table.HeaderCell>
        <Table.HeaderCell>
          <Button onClick={selectType} type={selectedType}>{selectedType.name}</Button>
        </Table.HeaderCell>
      </Table.Row>
      <Table.Row>
        {selectedTasks.map(task => <Table.HeaderCell key={task.id}>{task.name}</Table.HeaderCell>)}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {studentTasks.map(student => (
        <Table.Row key={student.person.id} negative={student.person.name === ''}>
          <Table.Cell>
            {student.person.studentnumber} - {student.person.name}
          </Table.Cell>
          {student.tasks.map(task => (
            <Table.Cell key={task.taskId} selectable textAlign="center">
              <TaskUpdatePopup
                task={task}
                person={student.person}
                popUp={popUp}
                markTask={markTask}
                updateTask={updateTask}
              />
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

export default TaskResponseEditTable
