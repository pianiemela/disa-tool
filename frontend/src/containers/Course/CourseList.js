import React, { Component } from 'react'
import { List, Grid, Dropdown } from 'semantic-ui-react'

import { getCourses, getInstancesOfCourse } from '../../actions/actions'


class CourseList extends Component {
  state = {
    courses: [],
    course: undefined,
    instances: []
  }

  componentDidMount = async () => {
    const courses = await getCourses().then(res => res.data)
    console.log(courses)
    this.setState({ courses })
  }

  handleChange = async (e, data) => {
    if (data.value !== this.state.course) {
      await this.setState({ course: data.value })
      const instances = await getInstancesOfCourse(this.state.course).then(res => res.data)
      this.setState({ instances })
      console.log(instances)
    }
  }

  render() {
    return (
      <Grid columns={1} centered padded="vertically">
        <Grid.Row>
          <Grid.Column width={8}>
            <Dropdown
              fluid
              search
              selection
              value={this.state.course}
              options={this.state.courses.map(course => ({ key: course.id, text: course.name, value: course.id }))}
              onChange={this.handleChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <List selection>
              {this.state.instances.map(instance => <List.Item>{instance.name}</List.Item>)}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default CourseList
