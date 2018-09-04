import React from 'react'
import { Button, Table } from 'semantic-ui-react'

import TaskUpdatePopup from './components/TaskUpdatePopup'

const findPersonTask = (person, updatedTasks, task) => {
  const taskUpdated = updatedTasks
    .find(updatedTask => person.id === updatedTask.personId && updatedTask.taskId === task.id)
  if (taskUpdated) {
    return { taskId: task.id, id: taskUpdated.taskId, text: String(taskUpdated.points), color: 'brown' }
  }
  const taskMarked = person.task_responses.find(response => response.task_id === task.id)
  if (taskMarked) {
    return { ...taskMarked, taskId: task.id, text: String(taskMarked.points), color: 'black' }
  }
  return { ...task, taskId: task.id, text: '-', color: 'grey' }
}

const createSetOfNonRegisteredStudents = (updatedTasks) => {
  const nonRegisteredTasks = updatedTasks.filter(resp => resp.studentnumber)
  const nonRegisteredStudents = []
  for (let i = 0; i < nonRegisteredTasks.length; i += 1) {
    const resp = nonRegisteredTasks[i]
    const isStudentInList = nonRegisteredStudents.find(student =>
      student.studentnumber === resp.studentnumber)
    if (isStudentInList === undefined) {
      nonRegisteredStudents.push({
        id: resp.personId,
        studentnumber: resp.studentnumber,
        task_responses: [],
        name: ''
      })
    }
  }
  return nonRegisteredStudents
}

const TaskResponseEditTable = ({
  tasks,
  students,
  selectType,
  selectedType,
  markTask,
  updateTask,
  updatedTasks,
  popUp
}) => {
  const nonRegisteredStudents = createSetOfNonRegisteredStudents(updatedTasks)
  const allStudents = students.concat(nonRegisteredStudents)
  const selectedTasks = tasks.filter(task => task.types.find(type => type.id === selectedType.id))
  const studentTasks = allStudents.map(person => (
    { person, tasks: selectedTasks.map(task => findPersonTask(person, updatedTasks, task)) }
  ))
  return (
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
}

export default TaskResponseEditTable
