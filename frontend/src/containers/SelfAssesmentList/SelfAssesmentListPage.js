import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Loader, Accordion, Button, Icon } from 'semantic-ui-react'

import { getResponsesBySelfAssesment } from '../../api/selfassesment'

class SelfAssesmentListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      responses: []
    }
  }

  componentDidMount() {
    getResponsesBySelfAssesment({ id: this.props.selfAssesmentId }).then(response => this.setState({
      responses: response.data.data,
      loading: false
    }))
  }

  render() {
    if (this.state.loading) return <Loader active />
    return (
      <div className="SelfAssesmentListPage">
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
                  >
                    <span>Tarkastele</span>
                    <Icon name="angle double right" />
                  </Button>
                </Accordion.Content>
              )
            }))}
          />
        </Container>
      </div>
    )
  }
}

SelfAssesmentListPage.propTypes = {
  selfAssesmentId: PropTypes.number.isRequired
}

export default SelfAssesmentListPage
