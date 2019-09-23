import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Container, Form, Button, Icon, Loader, Grid, Accordion, Pagination } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { adminGetUsers, adminChangeGlobalRole } from './actions/persons'
import { adminChangeCourseRole, removeCoursePerson } from './actions/coursePersons'
import RoleList from './components/RoleList'

class AdminPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      getAll: false,
      loading: false,
      activeIndex: -1,
      activePage: 1,
      crash: false
    }
  }

  chaosMonkey = () => {
    this.setState({ crash: true })
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
    await this.props.adminGetUsers({
      studentInfo: this.state.getAll ? undefined : studentInfo,
      getAll: this.state.getAll
    })
    this.setState({ loading: false, activePage: 1 })
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
    if (courseInstanceId) {
      await this.props.adminChangeCourseRole({
        personId,
        courseInstanceId,
        role
      })
    } else {
      await this.props.adminChangeGlobalRole({ personId, role })
    }
  }

  deleteRole = (personId, courseInstanceId) => () => this.props.removeCoursePerson({
    id: personId,
    course_instance_id: courseInstanceId
  })

  translate = id => this.props.translate(`Admin.AdminPage.${id}`)

  render() {
    if (this.state.crash) throw new Error('Ooh aah, error')
    const { activeIndex, activePage } = this.state
    return (
      <Container style={{ paddingTop: '100px' }} >
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <Form onSubmit={this.handleSubmit}>
                <h2>{this.translate('header')}</h2>

                <Form.Field width={8}>
                  <input name="userInfo" disabled={this.state.getAll} placeholder={`(${this.translate('search_placeholder')})`} />
                </Form.Field>
                <Form.Checkbox name="getAll" onChange={() => this.setState({ getAll: !this.state.getAll })} label={this.translate('get_all')} />
                <Button><Icon name="search" />{this.translate('search_button')}</Button>
              </Form>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              {this.state.loading &&
                <Loader active />
              }

              {this.props.users.length > 0 &&
                <Accordion fluid styled>
                  {this.props.users.slice((activePage - 1) * 20, activePage * 20).map(u =>
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
                          <RoleList
                            translate={this.props.translate}
                            user={u}
                            deleteRole={this.deleteRole}
                            changeRole={this.changeRole}
                          />
                        </Accordion.Content>
                      </div>
                    ))}
                </Accordion>
              }
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={5} />
            <Grid.Column width={8}>
              {this.props.users.length > 20 ?
                <Pagination
                  activePage={activePage}
                  onPageChange={this.handlePaginationChange}
                  totalPages={Math.ceil(this.props.users.length / 20)}
                />
                :
                null
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Button content="Do not press!" color="red" onClick={this.chaosMonkey} />
      </Container>
    )
  }
}

AdminPage.propTypes = {
  dispatchToast: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  adminGetUsers: PropTypes.func.isRequired,
  adminChangeCourseRole: PropTypes.func.isRequired,
  adminChangeGlobalRole: PropTypes.func.isRequired,
  removeCoursePerson: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  users: state.admin.users
})

const mapDispatchToProps = dispatch => ({
  adminGetUsers: asyncAction(adminGetUsers, dispatch),
  adminChangeCourseRole: asyncAction(adminChangeCourseRole, dispatch),
  adminChangeGlobalRole: asyncAction(adminChangeGlobalRole, dispatch),
  dispatchToast: data => dispatch(data),
  removeCoursePerson: asyncAction(removeCoursePerson, dispatch)
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(AdminPage))
