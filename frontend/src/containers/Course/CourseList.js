import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Header, List, Grid, Dropdown } from 'semantic-ui-react'
import parseQueryParams from '../../utils/parseQueryParams'

import { getCourses, getInstancesOfCourse } from '../../actions/actions'


class CourseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courses: [],
      course: undefined,
      instances: [],
      instance: undefined
    }
    if (this.props.location.query_params.id) {
      this.state.course = {
        id: Number(this.props.location.query_params.id)
      }
    }
  }

  componentDidMount = async () => {
    const courses = await getCourses().then(res => res.data)
    this.setState({ courses })
  }

  handleChange = async (e, data) => {
    if (data.value && data.value !== this.state.course) {
      const selectedCourse = this.state.courses.find(course => course.id === data.value)
      await this.setState({ course: selectedCourse })
      const instances = await getInstancesOfCourse(this.state.course.id).then(res => res.data)
      await this.setState({ instances, instance: undefined })
    }
  }

  selectInstance = (e, data) => {
    const selectedInstance = this.state.instances.find(instance => instance.id === Number(data.value))
    this.setState({ instance: selectedInstance })
  }

  render() {
    console.log(this.props)
    return (
      <Grid columns={1} padded="vertically">
        <Grid.Row centered>
          <Grid.Column width={8}>
            <Dropdown
              fluid
              search
              selection
              value={this.state.course ? this.state.course.id : undefined}
              options={this.state.courses.map(course =>
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
              {this.state.instances.map(instance => (
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
                    <Button>Luo uusi instanssi tästä kurssista</Button>
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

CourseList.propTypes = {
  location: PropTypes.shape({
    query_params: PropTypes.object.isRequired
  }).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  userCourses: state.courses,
  location: parseQueryParams(ownProps.location)
})

// const mapDispatchToProps = dispatch => ({

// })

export default connect(mapStateToProps, null)(CourseList)
