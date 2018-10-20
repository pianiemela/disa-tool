import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { shape, string, arrayOf, func, number } from 'prop-types'
import { Accordion, Dimmer, Header, Grid, Item, Loader } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

import {
  getUserCoursesAction,
  getUserSelfAssesments,
  getCourseInstanceDataAction,
  toggleCourseActivityAction,
  toggleAssessmentAction
} from '../../actions/actions'
import CourseSideMenu from './CourseSideMenu'
import { ListTasks } from './ListTasks'
import CourseSelfAssessmentsList from './CourseSelfAssessmentsList'
import CourseInfo from './CourseInfo'
import TaskResponseEdit from './TaskResponseEdit'
import ManageCoursePeople from './ManageCoursePeople'

class UserPage extends Component {
  state = {
    // Selected type will now never change. Is it really needed in the task listing?
    loading: false,
    selectedType: undefined
  }

  componentDidMount = async () => {
    const { activeCourse } = this.props
    const { courseId } = this.props.match.params

    await this.props.dispatchGetUserCourses()
    // this.props.dispatchGetUserSelfAssesments()
    if (courseId && !activeCourse.id && !this.state.loading) {
      await this.setState({ loading: true })
      this.props.dispatchGetCourseInstanceData(courseId).then(() => (
        this.setState({ loading: false })
      ))
    }
  }

  t = id => this.props.translate(`UserPage.common.${id}`)

  handleActivityToggle = async () => {
    const { activeCourse } = this.props
    this.props.dispatchToggleActivity(activeCourse.id).then(res => console.log(res))
  }

  handleClick = async (e, { course }) => {
    // this.setState({ activeCourse: course })
    // Fetch all relevant course information: tasks with responses & assessments with responses.
    if (!this.state.loading && this.props.match.params.courseId) {
      await this.setState({ loading: true })
      await this.props.dispatchGetCourseInstanceData(course.id)
      await this.setState({ loading: false })
    }
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
    const { activeCourse, courses, user } = this.props
    const { selectedType, loading } = this.state
    const { self_assessments: assessments, tasks } = activeCourse
    if (!this.props.match.params.courseId && activeCourse.id) {
      return <Redirect to={`/user/course/${activeCourse.id}`} />
    }
    const isTeacher = activeCourse.courseRole === 'TEACHER'
    const isGlobalTeacher = user.role === 'TEACHER' || user.role === 'ADMIN'
    const students = activeCourse.id && isTeacher ?
      activeCourse.people.filter(person =>
        person.course_instances[0].course_person.role !== 'TEACHER') : []
    const teachers = activeCourse.id ?
      activeCourse.people.filter(person =>
        person.course_instances[0].course_person.role === 'TEACHER') : []
    // console.log(activeCourse)
    // console.log(this.props.match.params.courseId)
    return (
      <Grid padded="horizontally">
        <Dimmer active={loading} inverted>
          <Loader inverted />
        </Dimmer>
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
                    isTeacher={isTeacher}
                    isGlobalTeacher={isGlobalTeacher}
                  />
                  {isGlobalTeacher ?
                    <Grid.Row>
                      <Grid.Column>
                        <ManageCoursePeople
                          activeCourse={activeCourse}
                          people={activeCourse.people}
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
  dispatchToggleAssessment: func.isRequired,
  translate: func.isRequired
}

UserPage.defaultProps = {
  courses: [],
  activeCourse: { tasks: [], self_assessments: [], people: [] }
}

export default withLocalize(connect(mapStateToProps, {
  dispatchGetUserCourses: getUserCoursesAction,
  dispatchGetUserSelfAssesments: getUserSelfAssesments,
  dispatchGetCourseInstanceData: getCourseInstanceDataAction,
  dispatchToggleActivity: toggleCourseActivityAction,
  dispatchToggleAssessment: toggleAssessmentAction
})(UserPage))
