import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { shape, string, arrayOf, func, number } from 'prop-types'
import { Accordion, Button, Header, Grid, Item, Dropdown } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

import {
  getUserCoursesAction,
  getUserSelfAssesments,
  getCourseInstanceDataAction,
  toggleCourseActivityAction,
  updateCoursePersonRoleAction,
  toggleAssessmentAction
} from '../../actions/actions'
import CourseSideMenu from './CourseSideMenu'
import { ListTasks } from './ListTasks'
import CourseSelfAssessmentsList from './CourseSelfAssessmentsList'
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

  t = id => this.props.translate(`UserPage.common.${id}`)

  handleActivityToggle = async () => {
    const { activeCourse } = this.props
    console.log('props', activeCourse.id)
    this.props.dispatchToggleActivity(activeCourse.id).then(res => console.log(res))
  }

  handleTeacherAdding = (e, { value }) => {
    if (e.target.name === 'teacherAddButton') {
      const formattedRequest = this.state.newTeachers.map(teacher => (
        { person_id: teacher, course_instance_id: this.props.activeCourse.id, role: 'TEACHER' }
      ))
      this.props.dispatchUpdateCoursePersonRole(formattedRequest)
        .then(() => this.setState({ newTeachers: [] }))
    } else {
      this.setState({ newTeachers: value })
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
            {this.props.user ? <Header as="h1">{this.t('hello')} {this.props.user.name}</Header> :
            <p>Hello bastard</p>}
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
                          placeholder={this.t('select_teacher')}
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
                          content={this.t('add_teacher')}
                          onClick={this.handleTeacherAdding}
                        />
                      </Grid.Column>
                    </Grid.Row> : undefined
                  }
                  <Grid.Row>
                    <Grid.Column floated="left" width={8}>
                      <Item.Content>
                        <Header as="h3">{this.t('tasks')}</Header>
                        <Accordion
                          defaultActiveIndex={-1}
                          styled
                          fluid
                          panels={[{
                            key: 'ListTasks',
                            title: this.t('open_task_list'),
                            content: {
                              key: 'tasks',
                              content: <ListTasks
                                tasks={tasks}
                                selectedType={selectedType}
                              />
                            }
                          }]}
                        />
                      </Item.Content>
                    </Grid.Column>
                    <Grid.Column floated="right" width={8}>
                      <Item.Content>
                        <Header as="h3">{this.t('self_assessments')}</Header>
                        <CourseSelfAssessmentsList
                          assessments={assessments}
                          isTeacher={isTeacher}
                          toggleAssessment={this.toggleAssessment}
                        />
                      </Item.Content>
                    </Grid.Column>
                  </Grid.Row>
                  {isTeacher ?
                    <TaskResponseEdit tasks={tasks} students={students} /> : undefined}
                </Grid>
              </Item> :
              <Item>
                <Item.Content>{this.t('no_course_selected')}</Item.Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(UserPage))
