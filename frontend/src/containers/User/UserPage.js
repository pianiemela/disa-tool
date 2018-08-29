import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { shape, string, arrayOf, func, number } from 'prop-types'
import { Accordion, Button, Header, List, Grid, Item, Label, Dropdown } from 'semantic-ui-react'

import {
  getUserCoursesAction,
  getUserSelfAssesments,
  getCourseInstanceDataAction,
  toggleCourseActivityAction,
  updateCoursePersonRoleAction,
  toggleAssessmentAction
} from '../../actions/actions'
import { CourseSideMenu } from './CourseSideMenu'
import { ListTasks } from './ListTasks'
import { CourseInfo } from './CourseInfo'
import TaskResponseEdit from './TaskResponseEdit'

class UserPage extends Component {
  state = {
    // Selected type will now never change. Is it really needed in the task listing?
    selectedType: undefined,
    newTeachers: []
  }

  componentDidMount = async () => {
    const { activeCourse } = this.props
    const { courseId } = this.props.match.params

    await this.props.dispatchGetUserCourses()
    // this.props.dispatchGetUserSelfAssesments()
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

  handleActivityToggle = async () => {
    const { activeCourse } = this.props
    console.log('props', activeCourse.id)
    this.props.dispatchToggleActivity(activeCourse.id).then(res => console.log(res))
  }

  handleTeacherAdding = (e, { value }) => {
    if (e.target.name !== 'teacherAddButton') {
      this.setState({ newTeachers: value })
    } else {
      const formattedRequest = this.state.newTeachers.map(teacher => (
        { person_id: teacher, course_instance_id: this.props.activeCourse.id, role: 'TEACHER' }
      ))
      this.props.dispatchUpdateCoursePersonRole(formattedRequest)
        .then(() => this.setState({ newTeachers: [] }))
    }
  }

  handleTeacherRemoving = (e, { value }) => {
    const formattedRequest = [{
      person_id: value,
      course_instance_id: this.props.activeCourse.id,
      role: 'STUDENT'
    }]
    this.props.dispatchUpdateCoursePersonRole(formattedRequest)
  }

  handleClick = async (e, { course }) => {
    // this.setState({ activeCourse: course })
    // Fetch all relevant course information: tasks with responses & assessments with responses.
    this.props.dispatchGetCourseInstanceData(course.id)
  }


  toggleAssessment = (e, { value }) => {
    switch (e.target.name) {
      case 'assessmentOpen':
        this.props.dispatchToggleAssessment(value, 'open')
        break
      case 'assessmentActive':
        this.props.dispatchToggleAssessment(value, 'active')
        break
      case 'feedbackOpen':
        this.props.dispatchToggleAssessment(value, 'show_feedback')
        break
      default:
        console.log('Something went wrong here now')
    }
  }

  render() {
    const { activeCourse, courses } = this.props
    const { selectedType } = this.state
    const { self_assessments: assessments, tasks } = activeCourse
    if (!this.props.match.params.courseId && activeCourse.id) {
      return <Redirect to={`/user/course/${activeCourse.id}`} />
    }
    const isTeacher = activeCourse.courseRole === 'TEACHER'
    const students = activeCourse.id && isTeacher ?
      activeCourse.people.filter(person =>
        person.course_instances[0].course_person.role !== 'TEACHER') : []
    const teachers = activeCourse.id && isTeacher ?
      activeCourse.people.filter(person =>
        person.course_instances[0].course_person.role === 'TEACHER') : []
    // console.log(activeCourse)
    // console.log(this.props.match.params.courseId)
    return (
      <Grid padded="horizontally">
        <Grid.Row>
          <Grid.Column>
            {this.props.user ? <Header as="h1">Hei {this.props.user.name}</Header> : <p>Hello bastard</p>}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <CourseSideMenu
              courses={courses}
              activeCourse={activeCourse}
              handleChange={this.handleClick}
            />
          </Grid.Column>
          <Grid.Column width={13}>
            {activeCourse.id ?
              <Item>
                <Grid padded="horizontally">
                  <CourseInfo
                    course={activeCourse}
                    toggleActivation={this.handleActivityToggle}
                    teachers={teachers}
                    deleteTeacher={this.handleTeacherRemoving}
                  />
                  {isTeacher ?
                    <Grid.Row>
                      <Grid.Column>
                        <Dropdown
                          name="teacherSelector"
                          closeOnChange
                          closeOnBlur
                          fluid
                          multiple
                          selection
                          search
                          placeholder="Lisää opettaja"
                          value={this.state.newTeachers}
                          options={students.map(person => (
                            { key: person.id, text: person.name, value: person.id }
                          ))}
                          onChange={this.handleTeacherAdding}
                        />
                        <Button
                          name="teacherAddButton"
                          basic
                          color="pink"
                          content="Lisää opettaja"
                          onClick={this.handleTeacherAdding}
                        />
                      </Grid.Column>
                    </Grid.Row> : undefined
                  }
                  <Grid.Row>
                    <Grid.Column floated="left" width={8}>
                      <Item.Content>
                        <Header as="h3">Tehtävät</Header>
                        <Accordion
                          defaultActiveIndex={-1}
                          styled
                          fluid
                          panels={[{
                            key: 'ListTasks',
                            title: 'Katso tehtävälistaa',
                            content: {
                              key: 'tasks',
                              content: <ListTasks
                                tasks={tasks}
                                selectedType={selectedType}
                              />
                            }
                          }]}
                        />
                        {/* <ListTasks tasks={tasks} selectedType={selectedType} /> */}
                      </Item.Content>
                    </Grid.Column>
                    <Grid.Column floated="right" width={8}>
                      <Item.Content>
                        <Header as="h3">Itsearvioinnit</Header>
                        <List selection size="big">
                          {assessments.map(assessment => (
                            !assessment.active && activeCourse.courseRole !== 'TEACHER' ? undefined : (
                              <List.Item key={assessment.id} style={{ display: 'flex' }}>
                                <List.Content
                                  as={Link}
                                  to={activeCourse.courseRole === 'TEACHER' ?
                                    `/selfAssesment/list/${assessment.id}` :
                                    `/selfAssesment/response/${assessment.id}`}
                                  style={{ flexGrow: 1 }}
                                >
                                  {assessment.name}
                                </List.Content>
                                <List.Content floated="right">
                                  {activeCourse.courseRole === 'TEACHER' ?
                                    <div>
                                      <Button
                                        name="assessmentActive"
                                        color={assessment.active ? 'green' : 'red'}
                                        compact
                                        content={assessment.active ? 'näkyvillä' : 'piilotettu'}
                                        disabled={assessment.open}
                                        size="small"
                                        value={assessment.id}
                                        onClick={this.toggleAssessment}
                                      />
                                      <Button
                                        name="assessmentOpen"
                                        color={assessment.open ? 'green' : 'red'}
                                        compact
                                        content={assessment.open ? 'avoin' : 'suljettu'}
                                        disabled={!assessment.active}
                                        size="small"
                                        value={assessment.id}
                                        onClick={this.toggleAssessment}
                                      />
                                      <Button
                                        name="feedbackOpen"
                                        color={assessment.show_feedback ? 'green' : 'red'}
                                        compact
                                        content={assessment.show_feedback ? 'palaute' : 'palaute'}
                                        disabled={!assessment.active || !assessment.open}
                                        size="small"
                                        value={assessment.id}
                                        onClick={this.toggleAssessment}
                                      />
                                    </div> :
                                    <div>
                                      <Label
                                        color={assessment.open ? 'green' : 'red'}
                                        content={assessment.open ? 'avoin' : 'suljettu'}
                                      />
                                      <Label
                                        color={assessment.assessment_responses.length > 0 ? 'green' : 'red'}
                                        content={assessment.assessment_responses.length > 0 ? 'Vastattu' : 'Vastaamatta'}
                                      />
                                    </div>}
                                </List.Content>
                              </List.Item>)
                          ))}
                        </List>
                      </Item.Content>
                    </Grid.Column>
                  </Grid.Row>
                  {isTeacher ?
                    <TaskResponseEdit tasks={tasks} students={students} /> : undefined}
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
  dispatchGetUserCourses: () =>
    dispatch(getUserCoursesAction()),
  dispatchGetUserSelfAssesments: () =>
    dispatch(getUserSelfAssesments()),
  dispatchGetCourseInstanceData: courseId =>
    dispatch(getCourseInstanceDataAction(courseId)),
  dispatchToggleActivity: courseId =>
    dispatch(toggleCourseActivityAction(courseId)),
  dispatchUpdateCoursePersonRole: coursePersons =>
    dispatch(updateCoursePersonRoleAction(coursePersons)),
  dispatchToggleAssessment: (assessmentId, attribute) =>
    dispatch(toggleAssessmentAction(assessmentId, attribute))
})

const mapStateToProps = state => ({
  user: state.user,
  courses: state.courses,
  selfAssesments: state.selfAssesment.userSelfAssesments,
  activeCourse: state.instance
})

UserPage.propTypes = {
  user: shape({
    name: string
  }).isRequired,
  courses: arrayOf(shape({
    id: number.isRequired,
    name: string.isRequired
  })),
  activeCourse: shape(),
  dispatchGetCourseInstanceData: func.isRequired,
  match: shape({
    params: shape({
      courseId: string
    }).isRequired
  }).isRequired,
  dispatchGetUserCourses: func.isRequired,
  dispatchToggleActivity: func.isRequired,
  dispatchUpdateCoursePersonRole: func.isRequired,
  dispatchToggleAssessment: func.isRequired
}

UserPage.defaultProps = {
  courses: [],
  activeCourse: { tasks: [], self_assessments: [], people: [] }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
