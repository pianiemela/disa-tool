import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import { Container, Loader, Accordion, Button, Icon } from 'semantic-ui-react'

import { getResponsesBySelfAssesment } from '../../api/selfassesment'

import UserResultsPage from '../SelfAssesment/Userform/UserResultsPage'

class SelfAssesmentListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      responses: [],
      activeResponse: null
    }
  }

  componentDidMount() {
    getResponsesBySelfAssesment({ id: this.props.selfAssesmentId }).then(response => this.setState({
      responses: response.data.data,
      loading: false
    }))
  }

  renderList = () => (
    <Container>
      <Accordion
        fluid
        styled
        panels={this.state.responses.map(response => ({
          key: response.id,
          title: response.person.name,
          content: (
            <Accordion.Content key={response.id}>
              <Button
                as={Link}
                to={`/selfassesment/list/${this.props.selfAssesmentId}/${response.id}`}
                basic
                onClick={() => this.setState({ activeResponse: response })}
              >
                <span>Tarkastele</span>
                <Icon name="angle double right" />
              </Button>
            </Accordion.Content>
          )
        }))}
      />
    </Container>
  )

  renderResponse = () => {
    if (this.state.activeResponse === null) return <Redirect to={`/selfassesment/list/${this.props.selfAssesmentId}`} />
    const backButton = (
      <Button as={Link} to={`/selfassesment/list/${this.props.selfAssesmentId}`} basic>
        <Icon name="angle double left" />
        <span>Takaisin</span>
      </Button>
    )
    return (
      <div>
        <Container textAlign="center">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            {backButton}
            <h2 style={{ flexGrow: 1 }}>{this.state.activeResponse.person.name}</h2>
          </div>
        </Container>
        <UserResultsPage
          assesmentResponse={this.state.activeResponse.response}
          teacher
        />
        <Container>
          {backButton}
        </Container>
      </div>
    )
  }

  render() {
    if (this.state.loading) return <Loader active />
    return (
      <div className="SelfAssesmentListPage">
        <Switch>
          <Route exact path={`/selfassesment/list/${this.props.selfAssesmentId}`} render={this.renderList} />
          <Route exact path={`/selfassesment/list/${this.props.selfAssesmentId}/:id`} render={this.renderResponse} />
        </Switch>
      </div>
    )
  }
}

SelfAssesmentListPage.propTypes = {
  selfAssesmentId: PropTypes.number.isRequired
}

export default SelfAssesmentListPage
