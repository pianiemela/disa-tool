import React from 'react'
import { shape, arrayOf } from 'prop-types'
import { List, Label, Button, Icon, Input, Popup, Table } from 'semantic-ui-react'

const getTasksForType = (tasks, typeId) => (
  tasks.filter(task => task.types.find(type => type.id === typeId))
)

const findPersonTask = (person, updatedTasks, task) => {
  const taskUpdated = updatedTasks.find(updatedTask => person.id === updatedTask.personId && updatedTask.taskId === task.id)
  if (taskUpdated) {
    return { id: taskUpdated.taskId, text: taskUpdated.points, color: 'black' }
  }
  const taskMarked = person.task_responses.find(response => response.task_id === task.id)
  if (taskMarked) {
    return { ...taskMarked, text: taskMarked.points, color: 'green' }
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
        {types.map(header => header.types.map(type => <Table.HeaderCell key={type.id}><Button onClick={selectType} type={type}>{type.name}</Button></Table.HeaderCell>))}
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

const renderTaskTable = (selectedTasks, studentTasks, selectType, selectedType, markTask, updateTask, popUp) => (
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
        <Table.Row key={student.person.id}>
          <Table.Cell>
            {student.person.studentnumber} - {student.person.name}
          </Table.Cell>
          {student.tasks.map((task, i) => (
            // what is a good key for cells?
            <Table.Cell key={`${student.person.id},${task.id},${i}`} selectable textAlign="center">
              <Popup
                trigger={
                  <Button
                    content={task.text}
                    basic
                    size="small"
                    icon="edit"
                    color={task.color}
                    onClick={markTask}
                    task={task}
                    person={student.person}
                  />}
                on="click"
                content={
                  <div>
                    <Input
                      name="input"
                      onChange={updateTask}
                      value={popUp.show ? popUp.task.points : 0}
                    />
                    <Button
                      basic
                      name="update"
                      size="tiny"
                      content="päivitä"
                      color="green"
                      task={popUp.task}
                      onClick={updateTask}
                    />
                    <Button
                      basic
                      name="cancel"
                      size="tiny"
                      color="red"
                      content="peru muutokset"
                      task={popUp.task}
                      onClick={updateTask}
                    />
                  </div>}
                open={
                  popUp.show &&
                  popUp.task.taskId === task.id &&
                  popUp.person.id === student.person.id}
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
    // students.map((person) => {
    //   types.map(header => header.types.map(type => (
    //     getTasksForType(tasks, type.id).map(task => console.log(task.types))
    //     // person.task_responses.filter(response => console.log(response))
    //   )))
    // })
    return renderTypeTable(types, students, tasks, selectType)
  }
  const selectedTasks = tasks.filter(task => task.types.find(type => type.id === selectedType.id))
  const studentTasks = students.map(person => (
    { person, tasks: selectedTasks.map(task => findPersonTask(person, updatedTasks, task)) }
  ))
  return renderTaskTable(selectedTasks, studentTasks, selectType, selectedType, markTask, updateTask, popUp)
}

CoursePeopleList.propTypes = {
  students: arrayOf(shape()).isRequired
}

export default CoursePeopleList