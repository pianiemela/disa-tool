import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grid, Dimmer, Loader } from 'semantic-ui-react'
import CourseHeader from '../Course/components/header/CourseHeader'
import ManageCoursePeople from '../User/ManageCoursePeople'
import TaskResponseEdit from '../User/TaskResponseEdit'
import { getCourseInstanceTasksAction, getCourseInstanceDataAction } from '../../actions/actions'

export class CourseTasksPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  async componentDidMount() {
    const { course } = this.props
    const instanceHasData = course.people.length !== 0
    await this.setState({ loading: true })
    // If for some reason the redux instance is not set,
    // fetch the course data first, before getting the tasks
    // and set it to redux state
    if (!instanceHasData) {
      const { courseId } = this.props.location.state
      await this.props.getCourseInstanceDataAction(courseId)
    }
    await this.props.getCourseInstanceTasksAction(instanceHasData ? course : this.props.course)
    await this.setState({ loading: false })
  }


  render() {
    const { course } = this.props
    const { user } = this.props
    const { loading } = this.state
    const isTeacher = course.courseRole === 'TEACHER'
    const isGlobalTeacher = user.role === 'TEACHER' || user.role === 'ADMIN'

    const { tasks } = course
    const students = course.id && isTeacher ?
      course.people.filter(person =>
        person.course_instances[0].course_person.role !== 'TEACHER') : []

    return (
      <div>
        {loading ?
          <Dimmer active={loading} inverted>
            <Loader inverted />
          </Dimmer>
          :
          <Grid container>
            <Grid.Row>
              <CourseHeader
                instance={course}
              />
            </Grid.Row>
            {isGlobalTeacher &&
              <Grid.Row>
                <Grid.Column>
                  <ManageCoursePeople
                    activeCourse={course}
                    people={course.people}
                  />
                </Grid.Column>
              </Grid.Row>
            }
            <Grid.Row>
              <Grid.Column>
                <TaskResponseEdit
                  tasks={tasks}
                  students={students}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
      </div>


    )
  }
}

const mapStatetoProps = state => ({
  user: state.user,
  course: state.instance
})

const mapDispatchToProps = {
  getCourseInstanceTasksAction,
  getCourseInstanceDataAction

}

CourseTasksPage.defaultProps = {
  course: { people: [{}] }
}

CourseTasksPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      course: PropTypes.shape({
        id: PropTypes.number.isRequired
      }),
      courseId: PropTypes.number.isRequired
    })
  }).isRequired,
  course: PropTypes.shape({
    people: PropTypes.arrayOf(PropTypes.shape())
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    studentnumber: PropTypes.number,
    role: PropTypes.string
  }).isRequired,
  getCourseInstanceDataAction: PropTypes.func.isRequired,
  getCourseInstanceTasksAction: PropTypes.func.isRequired


}

export default connect(mapStatetoProps, mapDispatchToProps)(CourseTasksPage)
