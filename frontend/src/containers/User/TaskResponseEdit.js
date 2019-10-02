import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Prompt } from 'react-router'
import { Accordion, Button, Grid } from 'semantic-ui-react'

import UploadResponsesPage from '../TaskResponses/UploadResponsesPage'
import { postTaskResponseActions } from '../../actions/actions'
import TaskResponseTypeTable from './TaskResponseTypeTable'
import TaskResponseEditTable from './TaskResponseEditTable'
import InfoBox from '../../utils/components/InfoBox'

class TaskResponseEdit extends Component {
  state = {
    selectedType: undefined,
    updatedTasks: [],
    popUp: { show: false, task: undefined, person: undefined }
  }

  selectType = (e, { type }) => this.setState({
    selectedType: this.state.selectedType === type ? undefined : type
  })

  markTask = async (e, { task, person }) => {
    const { updatedTasks } = this.state
    const taskUpdated = updatedTasks.find(t => t.taskId === task.id && t.personId === person.id)
    if (taskUpdated) {
      await this.setState({ popUp: { show: true, task: taskUpdated, person } })
    } else if (task.task_id && task.person_id && task.points) {
      const existingTask = {
        responseId: task.id,
        taskId: task.task_id,
        personId: task.person_id,
        points: task.points
      }
      this.setState({
        updatedTasks: [...this.state.updatedTasks, existingTask],
        popUp: { show: true, task: existingTask, person }
      })
    } else {
      this.setState({
        updatedTasks: [
          ...this.state.updatedTasks,
          { taskId: task.id, personId: person.id, points: task.max_points }
        ]
      })
    }
  }

  updateTask = (e, { task }) => {
    switch (e.target.name) {
      case 'input':
        this.setState({
          popUp: {
            show: true,
            task: { ...this.state.popUp.task, points: e.target.value },
            person: this.state.popUp.person
          }
        })
        break
      case 'update': {
        const filteredTasks = this.state.updatedTasks.filter(et =>
          et.taskId !== task.taskId || et.personId !== task.personId)
        // input values are always strings, so convert to number
        task.points = Number(task.points)
        filteredTasks.push(task)
        this.setState({ updatedTasks: filteredTasks, popUp: { show: false } })
        break
      }
      case 'cancel': {
        const filteredTasks = this.state.updatedTasks.filter(et =>
          et.taskId !== task.taskId || et.personId !== task.personId)
        this.setState({ updatedTasks: filteredTasks, popUp: { show: false } })
        break
      }
      default:
        this.setState({ popUp: { show: false } })
    }
  }

  updateTasksFromFile = (updatedTasks) => {
    this.setState({ updatedTasks })
  }

  submitTaskUpdates = () => {
    this.props.dispatchTaskResponses({
      tasks: this.state.updatedTasks,
      courseId: this.props.activeCourse.id
    })
    this.setState({ updatedTasks: [] })
  }


  render() {
    const { activeCourse, tasks, students } = this.props
    const { selectedType, updatedTasks, popUp } = this.state
    return (
      <Grid style={{ overflowX: 'scroll' }}>
        <Prompt when={updatedTasks.length > 0} message="Sinulla on tallentamattomia muutoksia" />
        <Grid.Row>
          <Grid.Column>
            <Accordion
              defaultActiveIndex={-1}
              styled
              fluid
              panels={[{
                key: 'UploadComponent',
                title: 'Lataa tehtäviä csv-tiedostosta',
                content: {
                  key: 'uploader',
                  content: <UploadResponsesPage
                    activeCourse={activeCourse}
                    updateHandler={this.updateTasksFromFile}
                  />
                }
              }]}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <InfoBox translationid="TasksInspect" buttonProps={{ floated: 'right' }} />
            <div>
              {!selectedType ?
                <TaskResponseTypeTable
                  typeHeaders={activeCourse.type_headers}
                  students={students}
                  tasks={tasks}
                  selectType={this.selectType}
                  updatedTasks={updatedTasks}
                /> :
                <TaskResponseEditTable
                  tasks={tasks}
                  students={students}
                  selectType={this.selectType}
                  selectedType={selectedType}
                  markTask={this.markTask}
                  updateTask={this.updateTask}
                  updatedTasks={updatedTasks}
                  popUp={popUp}
                />}
              <Button
                color="green"
                content="Tallenna muutokset"
                onClick={this.submitTaskUpdates}
              />
              <Button
                color="red"
                content="Peru kaikki muutokset"
                onClick={() => this.setState({ updatedTasks: [] })}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  activeCourse: state.instance
})

export default connect(mapStateToProps, { dispatchTaskResponses: postTaskResponseActions })(TaskResponseEdit)
