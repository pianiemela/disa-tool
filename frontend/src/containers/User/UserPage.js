import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { shape, string, arrayOf, func, number } from 'prop-types'
import { Button, List, Menu, Grid, Item, Label, Icon } from 'semantic-ui-react'
import {
  getUsersCourses,
  getUserAction,
  getUserCoursesAction,
  getUserSelfAssesments,
  getCourseInstanceData,
  getCourseInstanceDataAction,
  postTaskResponses
} from '../../actions/actions'
import { CoursePeopleList } from './CoursePeopleList'
import { ListTasks } from './ListTasks'

class UserPage extends Component {
  state = {
    activeCourse: undefined,
    assessments: [],
    tasks: [],
    selectedType: undefined,
    updatedTasks: [],
    popUp: { show: false, task: undefined, person: undefined }
  }

  componentDidMount = async () => {
    const { activeCourse } = this.props
    const { courseId } = this.props.match.params

    await this.props.dispatchGetUsercourses()
    this.props.dispatchGetUserSelfAssesments()
    if (courseId && !activeCourse.id) {
      this.props.dispatchGetCourseInstanceData(courseId)
    }
  }

  componentDidUpdate = async () => {
    const { activeCourse } = this.props
    const { courseId } = this.props.match.params
    if (courseId && (!activeCourse || activeCourse.id !== Number(courseId))) {
      console.log('imma updatin')
      this.props.dispatchGetCourseInstanceData(courseId)
    }
  }

  handleClick = async (e, { course }) => {
    // this.setState({ activeCourse: course })
    // Fetch all relevant course information: tasks with responses & assessments with responses.
    this.props.dispatchGetCourseInstanceData(course.id)
    // const courseInstanceData = await getCourseInstanceData(course.id).then(res => res.data)
    // const { assessments, tasks } = courseInstanceData
    // this.setState({ assessments, tasks })
  }

  selectType = (e, { type }) => this.setState({
    selectedType: this.state.selectedType === type ? undefined : type
  })

  markTask = async (e, { task, person }) => {
    // console.log(task, person)
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
        this.setState({ popUp: { show: true, task: { ...this.state.popUp.task, points: e.target.value }, person: this.state.popUp.person } })
        break
      case 'update': {
        const filteredTasks = this.state.updatedTasks.filter(et => et.taskId !== task.taskId || et.personId !== task.personId)
        // input values are always strings, so convert to number
        task.points = Number(task.points)
        filteredTasks.push(task)
        this.setState({ updatedTasks: filteredTasks, popUp: { show: false } })
        break
      }
      case 'cancel': {
        const filteredTasks = this.state.updatedTasks.filter(et => et.taskId !== task.taskId || et.personId !== task.personId)
        this.setState({ updatedTasks: filteredTasks, popUp: { show: false } })
        break
      }
      default:
        this.setState({ popUp: { show: false } })
    }
  }

  submitTaskUpdates = () => {
    postTaskResponses({ tasks: this.state.updatedTasks, courseId: this.props.activeCourse.id })
      .then(res => console.log(res))
  }

  render() {
    const { activeCourse, courses } = this.props
    const { selectedType, updatedTasks, popUp } = this.state
    const { self_assessments: assessments, tasks } = activeCourse
    if (!this.props.match.params.courseId && activeCourse.id) {
      return <Redirect to={`/user/course/${activeCourse.id}`} />
    }
    console.log(updatedTasks)
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {this.props.user ? <h1>Hei {this.props.user.name}</h1> : <p>Hello bastard</p>}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <Menu fluid vertical tabular>
              {courses.map(course => (
                <Menu.Item
                  key={course.id}
                  as={Link}
                  to={`/user/course/${course.id}`}
                  name={course.name}
                  course={course}
                  active={activeCourse === course}
                  onClick={this.handleClick}
                >
                  {course.name}
                </Menu.Item>))}
            </Menu>
          </Grid.Column>
          <Grid.Column width={13}>
            {activeCourse.id ?
              <Item>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Item.Header as="h1">{activeCourse.name}</Item.Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Button as={Link} to={`/selfAssesment/${activeCourse.id}`} color="green" basic>Luo uusi itsearviointi</Button>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Button as={Link} to={`/course/${activeCourse.id}`} color="blue" basic>Muokkaa kurssia</Button>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Item.Content>
                        <ListTasks tasks={tasks} selectedType={selectedType} />
                      </Item.Content>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Item.Content>
                        <p>Itsearvioinnit</p>
                        <List selection size="big">
                          {assessments.map(assessment => <List.Item key={assessment.id} as={Link} to={`/selfAssesment/response/${assessment.id}`}>{assessment.name}</List.Item>)}
                        </List>
                      </Item.Content>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column style={{ overflowX: 'scroll' }}>
                      {activeCourse.courseRole === 'TEACHER' ?
                        <div>
                          <CoursePeopleList
                            popUp={popUp}
                            updatedTasks={updatedTasks}
                            markTask={this.markTask}
                            updateTask={this.updateTask}
                            selectType={this.selectType}
                            selectedType={selectedType}
                            types={activeCourse.type_headers}
                            tasks={tasks}
                            students={activeCourse.people.filter(person =>
                              person.course_instances[0].course_person.role !== 'TEACHER')}
                          />
                          <Button color="green" onClick={this.submitTaskUpdates}>Tallenna muutokset</Button>
                        </div>
                        : <p>you are no teacher</p>}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    {/* <List items={activeCourse.people.filter(person =>
                      person.course_instances[0].course_person.role === 'TEACHER').map(person => person.name)}
                    /> */}
                  </Grid.Row>
                </Grid>
              </Item> :
              <Item>
                <Item.Content>Kurssia ei valittu</Item.Content>
              </Item>}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchGetUsercourses: () =>
    dispatch(getUserCoursesAction()),
  dispatchGetUserSelfAssesments: () =>
    dispatch(getUserSelfAssesments()),
  dispatchGetCourseInstanceData: courseId =>
    dispatch(getCourseInstanceDataAction(courseId))
})

const mapStateToProps = state => ({
  user: state.user,
  courses: state.courses,
  selfAssesments: state.selfAssesment.userSelfAssesments,
  activeCourse: state.instance
})

UserPage.propTypes = {
  user: shape({
    name: string.isRequired
  }).isRequired,
  courses: arrayOf(shape({
    id: number.isRequired,
    name: string.isRequired
  })),
  activeCourse: shape(),
  dispatchGetCourseInstanceData: func.isRequired
}

UserPage.defaultProps = {
  courses: [],
  activeCourse: { tasks: [], self_assessments: [], people: [] }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
