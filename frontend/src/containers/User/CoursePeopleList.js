import React from 'react'
import { shape, arrayOf } from 'prop-types'
import { Button, Table } from 'semantic-ui-react'

import TaskResponseTypeTable from './TaskResponseTypeTable'
import TaskResponseEditTable from './TaskResponseEditTable'

const getTasksForType = (tasks, typeId) => (
  tasks.filter(task => task.types.find(type => type.id === typeId))
)

const findPersonTask = (person, updatedTasks, task) => {
  const taskUpdated = updatedTasks
    .find(updatedTask => person.id === updatedTask.personId && updatedTask.taskId === task.id)
  if (taskUpdated) {
    return { taskId: task.id, id: taskUpdated.taskId, text: String(taskUpdated.points), color: 'black' }
  }
  const taskMarked = person.task_responses.find(response => response.task_id === task.id)
  if (taskMarked) {
    return { ...taskMarked, taskId: task.id, text: String(taskMarked.points), color: 'green' }
  }
  return { ...task, taskId: task.id, text: '-', color: 'grey' }
}

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
    return (
      <TaskResponseTypeTable
        types={typesWithUpdates}
        students={students}
        tasks={tasks}
        selectType={selectType}
      />
    )
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
  return (
    <TaskResponseEditTable
      selectedTasks={selectedTasks}
      studentTasks={studentTasks}
      selectType={selectType}
      selectedType={selectedType}
      markTask={markTask}
      updateTask={updateTask}
      popUp={popUp}
    />
  )
}

CoursePeopleList.propTypes = {
  students: arrayOf(shape()).isRequired
}

export default CoursePeopleList
