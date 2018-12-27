import React, { PureComponent } from 'react'
import { arrayOf, string, number, bool } from 'prop-types'
import { Header, Pagination, Container } from 'semantic-ui-react'
import ResponseTable from './ResponseTable'
import { responseProp } from '../propTypes'

class ResponseList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      activePage: 1
    }
  }

  handlePaginationChange = (e, { activePage }) => (
    this.setState({ activePage })
  )

  render() {
    const { responses, responsesOnPage, selected } = this.props
    const { activePage } = this.state
    const displayed = responses.slice(
      (activePage - 1) * responsesOnPage,
      activePage * responsesOnPage
    )
    return (
      <Container style={{ marginTop: '10px' }}>
        <Header as="h2">
          {this.props.header}
          {this.props.subheader ? (
            <Header.Subheader>
              {this.props.subheader}
            </Header.Subheader>
          ) : null}
        </Header>
        <ResponseTable responses={displayed} selected={selected} />
        <Pagination
          activePage={activePage}
          onPageChange={this.handlePaginationChange}
          totalPages={Math.ceil(responses.length / responsesOnPage)}
        />
      </Container>
    )
  }
}

ResponseList.propTypes = {
  responses: arrayOf(responseProp).isRequired,
  header: string.isRequired,
  subheader: string,
  responsesOnPage: number,
  selected: bool
}

ResponseList.defaultProps = {
  subheader: null,
  responsesOnPage: 20,
  selected: false
}

export default ResponseList
