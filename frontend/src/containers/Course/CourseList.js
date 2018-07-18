import React, { Component } from 'react'
import { Menu, Grid, Dropdown } from 'semantic-ui-react'

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
      <Grid columns={1} centered padded="vertically">
        <Grid.Row>
          <Grid.Column width={8}>
            <Dropdown fluid search selection options={this.state.courses.map(course => ({ key: course.id, text: course.name, value: course.id }))} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default CourseList
