import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Header, List, Grid, Dropdown } from 'semantic-ui-react'
import parseQueryParams from '../../utils/parseQueryParams'
import asyncAction from '../../utils/asyncAction'

import { getCourses } from './services/courses'
import { getInstancesOfCourse } from './services/courseInstances'

import CreateInstanceForm from './components/CreateInstanceForm'

class CourseListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      course: undefined,
      instance: undefined
    }
    if (this.props.location.query_params.id) {
      this.state.course = {
        id: Number(this.props.location.query_params.id)
      }
    }
  }

  componentDidMount = async () => {
    await this.props.getCourses()
  }

  handleChange = async (e, data) => {
    if (data.value && data.value !== this.state.course) {
      const selectedCourse = this.props.courses.find(course => course.id === data.value)
      await this.setState({ course: selectedCourse })
      await this.props.getInstancesOfCourse(this.state.course.id)
    }
  }

  selectInstance = (e, data) => {
    const selectedInstance = this.props.instances.find(instance => instance.id === Number(data.value))
    this.setState({ instance: selectedInstance })
  }

  render() {
    return (
      <Grid columns={1} padded="vertically">
        <Grid.Row centered>
          <Grid.Column width={8}>
            <Dropdown
              fluid
              search
              selection
              value={this.state.course ? this.state.course.id : undefined}
              options={this.props.courses.map(course =>
                ({ key: course.id, text: course.name, value: course.id }))
                .concat([{
                  as: Link,
                  to: 'courses/create',
                  key: 0,
                  icon: { name: 'add', color: 'green' },
                  style: { color: 'green' },
                  text: 'Luo uusi kurssi'
                }])
              }
              onChange={this.handleChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <List selection>
              {this.props.instances.map(instance => (
                <List.Item
                  style={instance.active ? { color: 'blue' } : undefined}
                  key={instance.id}
                  onClick={this.selectInstance}
                  value={instance.id.toString()}
                >
                  {instance.name}
                </List.Item>
              ))}
            </List>
          </Grid.Column>
          <Grid.Column width={4}>
            {this.state.course ?
              <div>
                {this.state.instance ?
                  <div>
                    <h2>{this.state.instance.name}</h2>
                    <Header as="h2" color={this.state.instance.active ? 'green' : 'red'}>
                      <Header.Subheader>Tämä kurssi on tällä hetkellä </Header.Subheader>
                      {this.state.instance.active ? <span><b>käynnissä</b></span> : <span><b>ei käynnissä</b></span>}
                    </Header>
                    {this.props.userCourses && this.props.userCourses.find(course => course.id === this.state.instance.id) ?
                      <p>Olet kurssilla <Button as={Link} to={`/user/course/${this.state.instance.id}`}>Kurssisivulle</Button></p> : <p>et ole kurssilla</p>}
                    {this.state.instance.active ? <Button inverted color="blue">Rekisteröidy kurssille</Button> : undefined}
                  </div> :
                  <div>Valitse vielä kurssi-instanssi.</div>
                }
                {this.props.user && this.props.user.role === 'TEACHER' ?
                  <div>
                    <br />
                    <CreateInstanceForm course_id={this.state.course.id} />
                  </div> :
                  undefined
                }
              </div> :
              <div>Valitse ensin kurssi</div>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

CourseListPage.propTypes = {
  location: PropTypes.shape({
    query_params: PropTypes.object.isRequired
  }).isRequired,
  courses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  instances: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired
  })).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  userCourses: state.courses,
  location: parseQueryParams(ownProps.location),
  courses: state.listCourses.courses,
  instances: state.listCourses.instances
})

const mapDispatchToProps = dispatch => ({
  getCourses: asyncAction(getCourses, dispatch),
  getInstancesOfCourse: asyncAction(getInstancesOfCourse, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseListPage)
