import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Container, Form, Button, Icon, Loader, Grid, Accordion, List, Pagination } from 'semantic-ui-react'
import { getUsers, changeGlobalRole } from '../../api/persons'
import { changeCourseRole } from '../../api/coursePersons'

class AdminPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      getAll: false,
      users: [],
      loading: false,
      activeIndex: -1,
      activePage: 1
    }
  }

  handleSubmit = async (event) => {
    const studentInfo = event.target.userInfo.value
    if (!this.state.getAll && studentInfo === '') {
      await this.props.dispatchToast({
        type: '',
        payload: {
          toast: 'Syötä hakuparametri tai valitse kaikki',
          type: 'error'
        }
      })
      return
    }
    this.setState({
      loading: true
    })
    const userResponse = this.state.getAll ? (
      await getUsers({ getAll: true })
    ) : (
        await getUsers({ studentInfo, getAll: false })
      )
    const { data } = userResponse
    this.setState({ users: data, loading: false, activePage: 1 })
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

  toggleEdit = () => this.setState({ edit: !this.state.edit })

  changeRole = async (personId, courseInstanceId, role) => {
    const res = courseInstanceId ? (
      await changeCourseRole({ personId, courseInstanceId, role })
    ) : (
        await changeGlobalRole({ personId, role })
      )
    const { data } = res.data

    if (data.course_instance_id) {
      const person = this.state.users.find(u => u.id === data.person_id)
      const personCourses = person.course_people.map(cpe =>
        (cpe.course_instance_id === data.course_instance_id ? { ...cpe, role: data.role } : cpe))
      this.setState({
        users: this.state.users.map(u => (u.id === data.person_id ? {
          ...u,
          course_people: personCourses
        } : u))
      })
    } else {
      this.setState({
        users: this.state.users.map(u =>
          (u.id === data.id ? { ...u, role: data.role } : u))
      })
    }

    await this.props.dispatchToast({
      type: '',
      payload: {
        toast: res.data.message,
        type: 'message'
      }
    })
  }

  render() {
    const { activeIndex, activePage, users } = this.state
    return (
      <Container style={{ paddingTop: '100px' }} >
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <Form onSubmit={this.handleSubmit}>
                <h2>Hallinnoi käyttäjiä</h2>

                <Form.Field width={8}>
                  <input name="userInfo" disabled={this.state.getAll} placeholder="(Hae nimellä tai opiskelijanumerolla)" />
                </Form.Field>
                <Form.Checkbox name="getAll" onChange={() => this.setState({ getAll: !this.state.getAll })} label="Hae kaikki käyttäjät" />
                <Button><Icon name="search" />Hae</Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.state.loading ?
                <Loader active />
                :
                null
              }

              {this.state.users.length > 0 ?
                <Accordion fluid styled>
                  {this.state.users.slice((activePage - 1) * 20, activePage * 20).map(u =>
                    (
                      <div key={u.id}>
                        <Accordion.Title
                          active={activeIndex === u.id}
                          index={u.id}
                          onClick={this.handleClick}
                        >
                          <Icon name="dropdown" />
                          {u.name}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === u.id}>
                          <List divided>
                            <List.Item>
                              <List.Header>Roolit kursseilla</List.Header>
                            </List.Item>
                            {u.course_people.map(ucp => (
                              <List.Item key={ucp.id}>
                                <List.Content floated="right">
                                  <div>
                                    <Button.Group>
                                      <Button
                                        color="green"
                                        onClick={ucp.role === 'STUDENT' ? null : () => this.changeRole(u.id, ucp.course_instance_id, 'STUDENT')}
                                        inverted={ucp.role !== 'STUDENT'}
                                      >
                                        Student
                                      </Button>
                                      <Button
                                        onClick={ucp.role === 'TEACHER' ? null : () => this.changeRole(u.id, ucp.course_instance_id, 'TEACHER')}
                                        inverted={ucp.role !== 'TEACHER'}
                                        color="green"
                                      >
                                        Teacher
                                      </Button>
                                    </Button.Group>
                                  </div>
                                </List.Content>
                                <List.Content>
                                  {ucp.course_instance.name}
                                </List.Content>
                              </List.Item>
                            ))}
                            <List.Item>
                              <List.Content floated="right">
                                <Button.Group>
                                  <Button
                                    onClick={u.role === 'STUDENT' ? null : () => this.changeRole(u.id, null, 'STUDENT')}
                                    color="green"
                                    inverted={u.role !== 'STUDENT'}
                                  >
                                    Student
                                  </Button>
                                  <Button
                                    onClick={u.role === 'TEACHER' ? null : () => this.changeRole(u.id, null, 'TEACHER')}
                                    inverted={u.role !== 'TEACHER'}
                                    color="green"
                                  >
                                    Teacher
                                  </Button>
                                </Button.Group>
                              </List.Content>
                              <List.Content>
                                GLOBAL ROLE
                              </List.Content>
                            </List.Item>
                          </List>
                        </Accordion.Content>
                      </div>
                    ))}
                </Accordion>

                :
                null
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5} />
            <Grid.Column width={8}>
              {users.length > 20 ?
                <Pagination
                  activePage={activePage}
                  onPageChange={this.handlePaginationChange}
                  totalPages={Math.ceil(users.length / 20)}
                />
                :
                null
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container >
    )
  }
}

AdminPage.propTypes = {
  dispatchToast: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  dispatchGetUsersAction: data =>
    dispatch(getUsers(data)),
  dispatchToast: data =>
    dispatch(data)

})

export default connect(null, mapDispatchToProps)(AdminPage)
