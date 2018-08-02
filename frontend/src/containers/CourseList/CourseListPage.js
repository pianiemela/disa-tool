import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Header, List, Grid, Dropdown } from 'semantic-ui-react'
import parseQueryParams from '../../utils/parseQueryParams'
import asyncAction from '../../utils/asyncAction'

import { getCourses } from './services/courses'
import { getInstancesOfCourse } from './services/courseInstances'
import { selectCourse } from './actions/courses'
import { selectInstance } from './actions/courseInstances'

import CreateInstanceForm from './components/CreateInstanceForm'

class CourseListPage extends Component {

  componentDidMount = async () => {
    await this.props.getCourses()
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
                <div>
                  <CreateInstanceForm course_id={this.props.selectedCourse.id} />
                </div> :
                undefined
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
                    {this.props.userCourses && this.props.userCourses.find(course => course.id === this.props.selectedInstance.id) ?
                      <p>Olet kurssilla <Button as={Link} to={`/user/course/${this.props.selectedInstance.id}`}>Kurssisivulle</Button></p> : <p>et ole kurssilla</p>}
                    {this.props.selectedInstance.active ? <Button inverted color="blue">Rekisteröidy kurssille</Button> : undefined}
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
  })).isRequired,
  getCourses: PropTypes.func.isRequired,
  getInstancesOfCourse: PropTypes.func.isRequired,
  selectedCourse: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  selectedInstance: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired
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
  location: parseQueryParams(ownProps.location),
  courses: state.listCourses.courses,
  instances: state.listCourses.instances,
  selectedCourse: state.listCourses.selectedCourse,
  selectedInstance: state.listCourses.selectedInstance
})

const mapDispatchToProps = dispatch => ({
  getCourses: asyncAction(getCourses, dispatch),
  getInstancesOfCourse: asyncAction(getInstancesOfCourse, dispatch),
  selectCourse: selectCourse(dispatch),
  selectInstance: selectInstance(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseListPage)
