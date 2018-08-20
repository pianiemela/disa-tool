import React from 'react'
import { connect } from 'react-redux'
import { Container, Form, Button, Icon, Loader, Grid, Accordion, Input, List, Label, Pagination, Segment, GridRow } from 'semantic-ui-react'
import { getUsers } from '../../api/persons'

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
    let u = null
    const studentInfo = event.target.userInfo.value
    this.setState({
      loading: true
    })

    if (this.state.getAll) {
      u = await getUsers({ getAll: true })
    } else {
      u = await getUsers({ studentInfo, getAll: false })
    }
    const { data } = u
    this.setState({ users: data, loading: false })
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })


  render() {
    const { activeIndex, activePage, users } = this.state
    return (
      <Container style={{ paddingTop: '100px' }} >
        <Grid divided='vertically'>
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <Form onSubmit={this.handleSubmit}>
                <h2>Hallinnoi käyttäjiä</h2>

                <Form.Field width={8}>
                  <input name="userInfo" disabled={this.state.getAll} placeholder='(Hae nimellä tai opiskelijanumerolla)' />
                </Form.Field>
                <Form.Checkbox name="getAll" onChange={() => this.setState({ getAll: !this.state.getAll })} label='Hae kaikki käyttäjät' />
                <Button type='submit' ><Icon name="search" />Hae</Button>
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
                        <Accordion.Title active={activeIndex === u.id} index={u.id} onClick={this.handleClick}>
                          <Icon name='dropdown' />
                          {u.name}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === u.id}>
                          <List divided>
                            <List.Item>
                              <List.Header>Roolit kursseilla</List.Header>
                            </List.Item>
                            {u.course_people.map(ucp => (
                              <List.Item style={{ display: 'flex', alignItems: 'center' }} key={ucp.id}>
                                <span style={{ flexGrow: 1 }} > {ucp.course_instance.name} </span>
                                <List.Content>
                                  <Label color='green'>
                                    {ucp.role}
                                  </Label>
                                </List.Content>
                              </List.Item>
                            ))}
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

// const mapStatetoProps = state => ({

// })

// const mapDispatchToProps = dispatch => ({
//   dispatchGetUsersAction: data =>
//     dispatch(getUsers(data))
// })

export default connect()(AdminPage)
