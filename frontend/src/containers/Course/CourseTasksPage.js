import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grid, Dimmer, Loader } from 'semantic-ui-react'
import CourseHeader from '../Course/components/header/CourseHeader'
import ManageCoursePeople from '../User/ManageCoursePeople'
import TaskResponseEdit from '../User/TaskResponseEdit'
import { getCourseInstanceTasksAction } from '../../actions/actions'

export class CourseTasksPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  async componentDidMount() {
    const { course } = this.props.location.state
    await this.setState({ loading: true })
    this.props.getCourseInstanceTasksAction(course).then(() => {
      this.setState({ loading: false })
    })
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
        {loading || !course.people.length ?
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
  getCourseInstanceTasksAction
}

CourseTasksPage.defaultProps = {
  course: { people: [{}] }
}

CourseTasksPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      course: PropTypes.shape({
        id: PropTypes.number.isRequired
      })
    })
  }).isRequired,
  course: PropTypes.shape({
    people: PropTypes.arrayOf(PropTypes.shape())
  })


}

export default connect(mapStatetoProps, mapDispatchToProps)(CourseTasksPage)
