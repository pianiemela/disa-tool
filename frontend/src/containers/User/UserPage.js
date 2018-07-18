import React, { Component } from 'react'
import { connect } from 'react-redux'
import { shape, string, arrayOf, func } from 'prop-types'
import { List, Menu, Grid, Item } from 'semantic-ui-react'
import { getUsersCourses, getUserAction, getUserCoursesAction, getUserSelfAssesments } from '../../actions/actions'

class UserPage extends Component {
  state = {
    courses: [],
    activeCourse: undefined
  }

  componentDidMount = async () => {
    this.props.dispatchGetUsercourses()
    this.props.dispatchGetUserSelfAssesments()
    // getUsersCourses().then(res => this.setState({ courses: res.data }))
  }

  handleClick = (e, { course }) => {
    this.setState({ activeCourse: course })
    console.log(course)
  }

  render() {
    const { activeCourse, courses } = this.state
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
                    <Grid.Column>
                      <Item.Content>THIS IS A SEGMENT WITH STUFF IN IT</Item.Content>
                      <Item.Content>THIS IS A SEGMENT WITH STUFF IN IT</Item.Content>
                      <Item.Content>THIS IS A SEGMENT WITH STUFF IN IT</Item.Content>
                      <Item.Content>THIS IS A SEGMENT WITH STUFF IN IT</Item.Content>
                      <Item.Content>THIS IS A SEGMENT WITH STUFF IN IT</Item.Content>
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
