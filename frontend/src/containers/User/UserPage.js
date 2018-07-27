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
  getCourseInstanceDataAction
} from '../../actions/actions'

class UserPage extends Component {
  state = {
    activeCourse: undefined,
    assessments: [],
    tasks: []
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

  render() {
    const { activeCourse, courses } = this.props
    const { self_assessments: assessments, tasks } = activeCourse
    if (!this.props.match.params.courseId && activeCourse.id) {
      return <Redirect to={`/user/course/${activeCourse.id}`} />
    }
    // console.log(this.props)
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {this.props.user ? <h1>Hello {this.props.user.name}</h1> : <p>Hello bastard</p>}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <Menu fluid vertical tabular>
              {courses.map(course => (
                <Menu.Item
                  as={Link}
                  to={`/user/course/${course.id}`}
                  key={course.id}
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
                    <Grid.Column>
                      <Button as={Link} to={`/selfAssesment/${activeCourse.id}`} color="green" basic>Luo uusi itsearviointi</Button>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      {/* Display course info, tasks and their responses
                      and assessments with their responses.
                      If the user has teacher role for this course,
                      add buttons to create tasks or assessments. Also add teacher buttons
                      for submitting student responses and to view students and their responses.
                       */}
                      <Item.Content>
                        <p>Tehtävät</p>
                        <p><Icon name="checkmark" color="green" /> tehty, <Icon name="delete" color="red" /> ei tehty</p>
                        <List divided size="small">
                          {tasks.map(task => (
                            <List.Item key={task.id}>
                              {task.task_responses.length > 0 ?
                                <List.Icon verticalAlign="middle" name="checkmark" color="green" /> :
                                <List.Icon verticalAlign="middle" name="delete" color="red" />}
                              <List.Content>
                                {task.name} {task.types.map(type =>
                                  <Label key={type.id}>{type.header} {type.name}</Label>)}
                              </List.Content>
                            </List.Item>
                          ))}
                        </List>
                      </Item.Content>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Item.Content>
                        <p>Itsearvioinnit</p>
                        <List selection size="big">
                          {assessments.map(assessment => <List.Item as={Link} to={`/selfAssesment/response/${assessment.id}`}>{assessment.name}</List.Item>)}
                        </List>
                      </Item.Content>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item> :
              <Item>
                <Item.Content>No course selected</Item.Content>
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
  activeCourse: { tasks: [], self_assessments: [] }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
