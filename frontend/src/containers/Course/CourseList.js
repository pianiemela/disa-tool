import React, { Component } from 'react'
import { List, Grid } from 'semantic-ui-react'

import { getCourses } from '../../actions/actions'


class CourseList extends Component {
  state = {
    courses: []
  }

  componentDidMount = async () => {
    const courses = await getCourses().then(res => res.data)
    console.log(courses)
    this.setState({ courses })
  }

  render() {
    return (
      <Grid columns={1}>
        <Grid.Column>
          <List selection>
            {this.state.courses.map(course => <List.Item>{course.name}</List.Item>)}
          </List>
        </Grid.Column>
      </Grid>
    )
  }
}

export default CourseList
