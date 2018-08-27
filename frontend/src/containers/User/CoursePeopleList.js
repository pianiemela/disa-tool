import React from 'react'
import { shape, arrayOf } from 'prop-types'
import { Button, Table } from 'semantic-ui-react'

import TaskUpdatePopup from './components/TaskUpdatePopup'

const getTasksForType = (tasks, typeId) => (
  tasks.filter(task => task.types.find(type => type.id === typeId))
)

const findPersonTask = (person, updatedTasks, task) => {
  const taskUpdated = updatedTasks
    .find(updatedTask => person.id === updatedTask.personId && updatedTask.taskId === task.id)
  if (taskUpdated) {
    return { id: taskUpdated.taskId, text: String(taskUpdated.points), color: 'black' }
  }
  const taskMarked = person.task_responses.find(response => response.task_id === task.id)
  if (taskMarked) {
    return { ...taskMarked, text: String(taskMarked.points), color: 'green' }
  }
  return { ...task, text: '-', color: 'grey' }
}

const renderTypeTable = (types, students, tasks, selectType) => (
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

const renderTaskTable = (
  selectedTasks,
  studentTasks,
  selectType,
  selectedType,
  markTask,
  updateTask,
  popUp
) => (
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
            // what is a good key for cells?
            <Table.Cell key={task.id} selectable textAlign="center">
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

export const CoursePeopleList = ({
  students,
  types,
  tasks,
  selectType,
  selectedType,
  markTask,
  updatedTasks,
  popUp,
  updateTask
}) => {
  if (!selectedType) {
    // Find out what types the updated tasks are from and mark those types as updated. Use this info
    // to display types including updated tasks to the user.
    const typesWithUpdates = types.map(header => (
      { ...header,
        types: header.types.map(type => (
          { ...type,
            updated: getTasksForType(tasks, type.id).find(task =>
              updatedTasks.find(ut => ut.taskId === task.id))
          }))
      }))
    return renderTypeTable(typesWithUpdates, students, tasks, selectType)
  }
  const nonRegisteredTasks = updatedTasks.filter(resp => resp.studentnumber)
  const nonRegisteredStudents = []
  for (let i = 0; i < nonRegisteredTasks.length; i += 1) {
    const resp = nonRegisteredTasks[i]
    if (
      nonRegisteredStudents
        .find(student => student.studentnumber === resp.studentnumber) === undefined
    ) {
      nonRegisteredStudents.push({ id: resp.personId, studentnumber: resp.studentnumber, task_responses: [], name: '' })
    }
  }
  const allStudents = students.concat(nonRegisteredStudents)
  const selectedTasks = tasks.filter(task => task.types.find(type => type.id === selectedType.id))
  const studentTasks = allStudents.map(person => (
    { person, tasks: selectedTasks.map(task => findPersonTask(person, updatedTasks, task)) }
  ))
  return renderTaskTable(
    selectedTasks,
    studentTasks,
    selectType,
    selectedType,
    markTask,
    updateTask,
    popUp
  )
}

CoursePeopleList.propTypes = {
  students: arrayOf(shape()).isRequired
}

export default CoursePeopleList
