import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Header, List, Grid, Dropdown } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getAllCourses, selectCourse } from './actions/courses'
import { getInstancesOfCourse, selectInstance } from './actions/courseInstances'

import CreateInstanceForm from './components/CreateInstanceForm'
import RegisterForm from './components/RegisterForm'

class CourseListPage extends Component {
  componentDidMount = async () => {
    await this.props.getAllCourses()
  }

  handleChange = (e, data) => {
    if (data.value && data.value !== this.props.selectedCourse) {
      this.props.selectCourse(Number(data.value))
      this.props.selectInstance(undefined)
      this.props.getInstancesOfCourse(Number(data.value))
    }
  }

  selectInstance = (e, data) => {
    this.props.selectInstance(Number(data.value))
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
              value={this.props.selectedCourse ? this.props.selectedCourse.id : undefined}
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
              {this.props.user && this.props.user.role === 'TEACHER' && this.props.selectedCourse ?
                (
                  <List.Item style={{ color: 'green' }}>
                    <CreateInstanceForm course_id={this.props.selectedCourse.id} />
                  </List.Item>
                ) :
                null
              }
            </List>
          </Grid.Column>
          <Grid.Column width={4}>
            {this.props.selectedCourse ?
              <div>
                {this.props.selectedInstance ?
                  <div>
                    <h2>{this.props.selectedInstance.name}</h2>
                    <Header as="h2" color={this.props.selectedInstance.active ? 'green' : 'red'}>
                      <Header.Subheader>Tämä kurssi on tällä hetkellä </Header.Subheader>
                      {this.props.selectedInstance.active ? <span><b>käynnissä</b></span> : <span><b>ei käynnissä</b></span>}
                    </Header>
                    {this.props.selectedInstance.registered ?
                      <p>Olet kurssilla <Button as={Link} to={`/user/course/${this.props.selectedInstance.id}`}>Kurssisivulle</Button></p> : <p>et ole kurssilla</p>}
                    {this.props.selectedInstance.active ? <RegisterForm registered={this.props.selectedInstance.registered} instanceId={this.props.selectedInstance.id} /> : undefined}
                  </div> :
                  <div>Valitse vielä kurssi-instanssi.</div>
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
  courses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  instances: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired
  })).isRequired,
  getAllCourses: PropTypes.func.isRequired,
  getInstancesOfCourse: PropTypes.func.isRequired,
  selectedCourse: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  selectedInstance: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    registered: PropTypes.bool.isRequired
  }),
  selectCourse: PropTypes.func.isRequired,
  selectInstance: PropTypes.func.isRequired
}

CourseListPage.defaultProps = {
  selectedCourse: null,
  selectedInstance: null
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  userCourses: state.courses,
  courses: state.listCourses.courses,
  instances: state.listCourses.instances,
  selectedCourse: state.listCourses.selectedCourse,
  selectedInstance: state.listCourses.selectedInstance
})

const mapDispatchToProps = dispatch => ({
  getAllCourses: asyncAction(getAllCourses, dispatch),
  getInstancesOfCourse: asyncAction(getInstancesOfCourse, dispatch),
  selectCourse: selectCourse(dispatch),
  selectInstance: selectInstance(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseListPage)
