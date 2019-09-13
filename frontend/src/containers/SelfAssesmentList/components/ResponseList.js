import React, { PureComponent } from 'react'
import { arrayOf, string, number, bool, func } from 'prop-types'
import { Header, Pagination, Segment, Form } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
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
      },
      searched: ''
    }
  }

  handlePaginationChange = (e, { activePage }) => (
    this.setState({ activePage })
  )

  handleOnSearch = (_, { value }) => {
    this.setState({ searched: value, activePage: 1 })
  }

  handleOnSort = (headerindex) => {
    const { headerindex: prevheaderindex, asc } = this.state.sorted
    this.setState({ sorted: { headerindex, asc: headerindex === prevheaderindex ? !asc : true } })
  }

  render() {
    const { responses, responsesOnPage, selected } = this.props
    const { activePage, sorted, searched } = this.state
    const searchedLower = searched.toLowerCase()
    const responsesFiltered = searchedLower.length === 0 ? responses : responses.filter(
      e =>
        e.person && ((e.person.studentnumber && e.person.studentnumber.toLowerCase().includes(searchedLower)) ||
        (e.person.name && e.person.name.toLowerCase().includes(searchedLower)))
    )
    let sortedResponses
    switch (sorted.headerindex) {
      case 0:
        sortedResponses = _.orderBy(responsesFiltered, 'person.studentnumber', sorted.asc ? 'asc' : 'desc')
        break
      case 1:
        sortedResponses = _.orderBy(responsesFiltered, 'person.name', sorted.asc ? 'asc' : 'desc')
        break
      case 2:
        sortedResponses = _.orderBy(responsesFiltered, (o) => {
          const diff = calculateDifference(o)
          return diff ? [diff.mean, diff.sd] : [0]
        }, sorted.asc ? 'asc' : 'desc')
        break
      case 3:
        sortedResponses = _.orderBy(responsesFiltered, 'updated_at', sorted.asc ? 'asc' : 'desc')
        break
      default:
        sortedResponses = responsesFiltered
        break
    }
    const totalPages = Math.ceil(responsesFiltered.length / responsesOnPage)
    const activePageReal = Math.min(activePage, totalPages)
    const displayed = sortedResponses.slice(
      (activePageReal - 1) * responsesOnPage,
      activePageReal * responsesOnPage
    )
    return (
      <Segment>
        <Header as="h2">
          {this.props.header}
          {this.props.subheader ? (
            <Header.Subheader>
              {this.props.subheader}
            </Header.Subheader>
          ) : null}
        </Header>
        <Form>
          <Form.Field>
            <Form.Input placeholder={this.props.translate('SelfAssessmentList.ResponseList.Filter')} onChange={this.handleOnSearch} />
          </Form.Field>
        </Form>
        <ResponseTable
          responses={displayed}
          selected={selected}
          onSort={this.handleOnSort}
          sortedHeader={sorted}
        />
        <Pagination
          activePage={activePageReal}
          onPageChange={this.handlePaginationChange}
          totalPages={totalPages}
        />
      </Segment>
    )
  }
}

ResponseList.propTypes = {
  responses: arrayOf(responseProp).isRequired,
  header: string.isRequired,
  subheader: string,
  responsesOnPage: number,
  translate: func.isRequired,
  selected: bool
}

ResponseList.defaultProps = {
  subheader: null,
  responsesOnPage: 20,
  selected: false
}

export default withLocalize(ResponseList)
