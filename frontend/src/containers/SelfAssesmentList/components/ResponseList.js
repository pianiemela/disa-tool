import React, { PureComponent } from 'react'
import { arrayOf, string, number, bool } from 'prop-types'
import { Header, Pagination, Container } from 'semantic-ui-react'
import _ from 'lodash'
import ResponseTable, { calculateDifference } from './ResponseTable'
import { responseProp } from '../propTypes'

class ResponseList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      activePage: 1,
      sorted: {
        headerindex: 0,
        asc: true
      }
    }
  }

  handlePaginationChange = (e, { activePage }) => (
    this.setState({ activePage })
  )

  handleOnSort = (headerindex) => {
    const { headerindex: prevheaderindex, asc } = this.state.sorted
    this.setState({ sorted: { headerindex, asc: headerindex === prevheaderindex ? !asc : true } })
  }

  render() {
    const { responses, responsesOnPage, selected } = this.props
    const { activePage, sorted } = this.state
    let sortedResponses
    switch (sorted.headerindex) {
      case 0:
        sortedResponses = _.orderBy(responses, 'person.studentnumber', sorted.asc ? 'asc' : 'desc')
        break
      case 1:
        sortedResponses = _.orderBy(responses, 'person.name', sorted.asc ? 'asc' : 'desc')
        break
      case 2:
        sortedResponses = _.orderBy(responses, (o) => {
          const diff = calculateDifference(o)
          return diff ? [diff.mean, diff.sd] : [0]
        }, sorted.asc ? 'asc' : 'desc')
        break
      case 3:
        sortedResponses = _.orderBy(responses, 'updated_at', sorted.asc ? 'asc' : 'desc')
        break
      default:
        sortedResponses = responses
        break
    }
    const displayed = sortedResponses.slice(
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
        <ResponseTable
          responses={displayed}
          selected={selected}
          onSort={this.handleOnSort}
          sortedHeader={sorted}
        />
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
