import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Container, Loader, Accordion } from 'semantic-ui-react'

import { getResponsesBySelfAssesment } from '../../api/selfassesment'

class SelfAssesmentListPage extends PureComponent {
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
            panels={this.state.responses.map(response => ({
              key: response.id,
              title: response.person.name,
              content: (
                <div />
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
