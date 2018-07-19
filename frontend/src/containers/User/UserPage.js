import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-dom'
import { shape, string, arrayOf, func } from 'prop-types'
import { List, Menu, Grid, Item, Label, Icon } from 'semantic-ui-react'
import {
  getUsersCourses,
  getUserAction,
  getUserCoursesAction,
  getUserSelfAssesments,
  getCourseInstanceData } from '../../actions/actions'

class UserPage extends Component {
  state = {
    activeCourse: undefined,
    assessments: [],
    tasks: []
  }

  componentDidMount = async () => {
    this.props.dispatchGetUsercourses()
    this.props.dispatchGetUserSelfAssesments()
    // getUsersCourses().then(res => this.setState({ courses: res.data }))
  }

  handleClick = async (e, { course }) => {
    this.setState({ activeCourse: course })
    // Fetch all relevant course information: tasks with responses & assessments with responses.
    const courseInstanceData = await getCourseInstanceData(course.id).then(res => res.data)
    const { assessments, tasks } = courseInstanceData
    this.setState({ assessments, tasks })
    console.log(assessments)
    console.log(tasks)
  }

  render() {
    const { activeCourse, assessments, tasks } = this.state
    const { courses } = this.props
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
                  to={`/user/${course.id}`}
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
            {activeCourse ?
              <Item>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Item.Header as="h1">{activeCourse.name}</Item.Header>
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
                            <List.Item>
                              {task.task_responses.length > 0 ?
                                <List.Icon verticalAlign="middle" name="checkmark" color="green" /> :
                                <List.Icon verticalAlign="middle" name="delete" color="red" />}
                              <List.Content>
                                {task.name} {task.types.map(type =>
                                  <Label>{type.header} {type.name}</Label>)}
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
                          {assessments.map(assessment => <List.Item>{assessment.name}</List.Item>)}
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
    dispatch(getUserSelfAssesments())
})

const mapStateToProps = state => ({
  user: state.user,
  courses: state.courses,
  selfAssesments: state.selfAssesment.userSelfAssesments
})

UserPage.propTypes = {
  user: shape({
    name: string.isRequired
  }).isRequired,
  dispatchGetUser: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
