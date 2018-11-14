import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Link, Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { Container, Loader, Accordion, Button, Icon, Table, Pagination, Segment, Header } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'

import { getResponsesBySelfAssesment, updateVerificationAndFeedback } from '../../api/selfassesment'

import FeedbackPage from '../Feedback/FeedbackPage'
import LinkExport from '../User/components/LinkExport'

const replaceQuotesAndLineBreaks = string => (
  string.replace(/["]/g, '""').replace(/(\r\n|\n|\r)/gm, ' ')
)

const mapDifferenceColor = (diff) => {
  if (Math.abs(diff) > 2) return 'red'
  if (Math.abs(diff) > 1) return 'orange'
  return 'black'
}

class SelfAssesmentListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      responses: [],
      selectedResponses: [],
      activeResponse: null,
      updating: false,
      successful: 0,
      unSuccessful: 0,
      responsesOnScreen: 20,
      maxPages: 1,
      activePage: 1
    }
  }

  async componentDidMount() {
    const response = await getResponsesBySelfAssesment({ id: this.props.selfAssesmentId })
    this.setState({
      responses: response.data.data,
      loading: false,
      maxPages: Math.ceil(response.data.data.length / this.state.responsesOnScreen)
    })
  }

  translate = id => this.props.translate(`SelfAssessmentList.SelfAssessmentListPage.${id}`)

  regenarateFeedback = async () => {
    await this.setState({ loading: true, updating: true, successful: 0, unSuccessful: 0 })
    await Promise.all(this.state.selectedResponses.map(async (resp) => {
      try {
        const response = await updateVerificationAndFeedback(resp.id)
        const filtered = [response.data, ...this.state.responses.filter(r => resp.id !== r.id)]
        const filteredSelected = this.state.selectedResponses.filter(r => resp.id !== r.id)
        await this.setState({
          responses: filtered,
          selectedResponses: filteredSelected,
          successful: this.state.successful + 1
        })
      } catch (e) {
        await this.setState({
          unSuccessful: this.state.unSuccessful + 1
        })
      }
    }))
    this.setState({ loading: false, updating: false })
  }

  formatToCsv = () => {
    const { selectedResponses: responses } = this.state
    const formatted = responses.map((response) => {
      const findCalculatedGrade = (question) => {
        const { verification } = response.response
        const category = verification ?
          verification.categoryVerifications.find(c => c.categoryId === question.id)
          : { earnedGrade: { name: '' } }
        return category.earnedGrade.name
      }
      const questionResponses = response.response.questionModuleResponses.map(question => (
        { [`${question.name}_text`]: replaceQuotesAndLineBreaks(question.responseText),
          [`${question.name}_grade`]: question.grade_name,
          [`${question.name}_calculated_grade`]: findCalculatedGrade(question)
        }
      ))
      const openResponses = response.response.openQuestionResponses.map(question => (
        { [`${question.name}_text`]: replaceQuotesAndLineBreaks(question.responseText) }
      ))
      const { finalGradeResponse, verification } = response.response
      const finalResponse = finalGradeResponse.name ?
        { [`${finalGradeResponse.name}_text`]: replaceQuotesAndLineBreaks(finalGradeResponse.responseText),
          [`${finalGradeResponse.name}_grade`]: finalGradeResponse.grade_name,
          [`${finalGradeResponse.name}_min_grade`]: verification ?
            verification.overallVerification.minGrade : '',
          [`${finalGradeResponse.name}_max_grade`]: verification ?
            verification.overallVerification.maxGrade : '' }
        : {}
      const flattenedQuestions = questionResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      const flattenedOpens = openResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      return {
        studentnumber: response.person.studentnumber,
        name: response.person.name,
        ...flattenedQuestions,
        ...flattenedOpens,
        ...finalResponse
      }
    })
    return formatted
  }

  selectResponse = (e, { value }) => {
    const { selectedResponses } = this.state
    if (selectedResponses.find(resp => resp.id === value)) {
      this.setState({ selectedResponses: selectedResponses.filter(resp => resp.id !== value) })
    } else {
      const response = this.state.responses.find(resp => resp.id === value)
      this.setState({ selectedResponses: [...selectedResponses, response] })
    }
  }

  selectAll = () => {
    this.setState({ selectedResponses: [...this.state.responses] })
  }

  findVerifiactionGrade = (verification, categoryName) => {
    const category = verification.categoryVerifications.find(c => c.categoryName === categoryName)
    if (!category) {
      return null
    }
    return category.earnedGrade.name
  }

  responseAccordion = response => (
    <Accordion
      styled
      fluid
      panels={[{
        key: response.id,
        title: `${response.person.studentnumber} ${response.person.name}`,
        content: (
          <Accordion.Content key={response.id}>
            <Button
              as={Link}
              to={`/selfassesment/list/${this.props.selfAssesmentId}/${response.id}`}
              basic
              onClick={() => this.setState({ activeResponse: response })}
            >
              <span>{this.translate('inspect')}</span>
              <Icon name="angle double right" />
            </Button>
            {response.response.assessmentType === 'category' ? (
              <Table collapsing compact="very">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={{ textTransform: 'capitalize' }}>{this.translate('category')}</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">{this.translate('self_assessment')}</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">{this.translate('machine_review')}</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">difference</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {response.response.questionModuleResponses.map((qmResponse) => {
                    const diff = response.response.verification.categoryVerifications.find(c => qmResponse.id === c.categoryId).wantedGrade.difference
                    return (
                      <Table.Row key={qmResponse.id}>
                        <Table.Cell>{qmResponse.name}</Table.Cell>
                        <Table.Cell textAlign="center">{qmResponse.grade_name}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {this.findVerifiactionGrade(response.response.verification, qmResponse.name)}
                        </Table.Cell>
                        <Table.Cell textAlign="center" positive={diff < 0} negative={diff > 0} >
                          {diff}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            ) : null}
            {response.response.finalGradeResponse ? (
              <Table collapsing compact="very">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell textAlign="center">{this.translate('self_assessment')}</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">{this.translate('machine_review')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell><strong>{this.translate('final_grade')}</strong></Table.Cell>
                    <Table.Cell textAlign="center">{response.response.finalGradeResponse.grade_name}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {response.response.verification.overallVerification.minGrade}–
                      {response.response.verification.overallVerification.maxGrade}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            ) : null}
          </Accordion.Content>
        )
      }]}
    />
  )

  responseDifferences = (response) => {
    const { categoryVerifications } = response.response.verification
    const { length } = categoryVerifications
    const mean = categoryVerifications
      .reduce((acc, cur) => (acc + (cur.wantedGrade.difference / length)), 0)
    const sd = Math.sqrt((1 / (length - 1)) * categoryVerifications
      .reduce((acc, cur) => (acc + ((cur.wantedGrade.difference - mean) ** 2)), 0))
    return (
      <Table.Cell positive={mean < 0} negative={mean > 0}>
        {mean.toFixed(1)}, ±{sd.toFixed(1)}
      </Table.Cell>
    )
  }

  finalGradeMatches = response => (
    response.response.verification.overallVerification.minGrade === response.response.finalGradeResponse.grade_name
    || response.response.verification.overallVerification.maxGrade === response.response.finalGradeResponse.grade_name
  )

  handlePaginationChange = (e, { activePage }) => (
    this.setState({ activePage })
  )

  renderUpdating = () => (
    <Segment> success: {this.state.successful}, fail: {this.state.unSuccessful} </Segment>
  )

  renderListTable = (responses, selected) => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>selected</Table.HeaderCell>
          <Table.HeaderCell>student</Table.HeaderCell>
          <Table.HeaderCell>differences</Table.HeaderCell>
          <Table.HeaderCell>last updated</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {responses.map(response => (
          <Table.Row key={response.id}>
            <Table.Cell>
              <Button
                basic
                color="blue"
                icon={selected ? 'minus' : 'plus'}
                value={response.id}
                onClick={this.selectResponse}
              />
            </Table.Cell>
            <Table.Cell negative={!this.finalGradeMatches(response)}>
              {this.responseAccordion(response)}
            </Table.Cell>
            {this.responseDifferences(response)}
            <Table.Cell>{new Date(response.updated_at).toLocaleDateString()}</Table.Cell>
          </Table.Row>
      ))}
      </Table.Body>
    </Table>
  )

  renderList = () => {
    const { selectedResponses, responses, updating, activePage, responsesOnScreen } = this.state
    const notSelected = responses.filter(r => !selectedResponses.find(sr => sr === r))
    const displayed = notSelected.slice((activePage - 1) * responsesOnScreen, activePage * responsesOnScreen)
    return (
      <Container>
        { updating ? this.renderUpdating() : undefined }
        <Button content="valitse kaikki" onClick={this.selectAll} />
        <Button content="poista valinnat" onClick={() => this.setState({ selectedResponses: [] })} />
        {this.state.loading ? <Loader active /> :
        <div>
          <Header as="h2">Valitut itsearviot
            <Header.Subheader>
              {this.state.selectedResponses.length} / {this.state.responses.length}
            </Header.Subheader>
          </Header>
          {this.renderListTable(selectedResponses, true)}
          <Pagination
            activePage={activePage}
            onPageChange={this.handlePaginationChange}
            totalPages={this.state.maxPages}
          />
          <Header as="h2">Ei-valitut itsearviot</Header>
          {this.renderListTable(displayed, false)}
          <Pagination
            activePage={activePage}
            onPageChange={this.handlePaginationChange}
            totalPages={this.state.maxPages}
          />
        </div>}
      </Container>
    )
  }

  renderResponse = () => {
    if (this.state.activeResponse === null) return <Redirect to={`/selfassesment/list/${this.props.selfAssesmentId}`} />
    const backButton = (
      <Button as={Link} to={`/selfassesment/list/${this.props.selfAssesmentId}`} basic>
        <Icon name="angle double left" />
        <span>{this.translate('back')}</span>
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
        <FeedbackPage
          assessmentResponse={this.state.activeResponse.response}
          teacher
        />
        <Container>
          {backButton}
        </Container>
      </div>
    )
  }

  render() {
    // if (this.state.loading) return <Loader active />
    // console.log(this.state)
    return (
      <div className="SelfAssesmentListPage">
        <Container>
          <Segment.Group>
            <Segment style={{ display: 'flex' }}>
              <LinkExport style={{ flexShrink: 1 }} title={`${this.translate('link')}: `} url={`/selfassesment/response/${this.props.selfAssesmentId}`} />
            </Segment>
            <Segment>
              <Header style={{ whiteSpace: 'nowrap', marginRight: '80px' }}>{this.props.selfAssesment.name}</Header>
              <Button
                basic
                color="blue"
                content={this.translate('generate_feedback')}
                onClick={this.regenarateFeedback}
              />
              <Button
                as={CSVLink}
                basic
                color="green"
                content={this.translate('download_csv')}
                data={this.formatToCsv()}
                filename={`${this.props.selfAssesment.name}_responses.csv`}
              />
            </Segment>
          </Segment.Group>
        </Container>
        <Switch>
          <Route exact path={`/selfassesment/list/${this.props.selfAssesmentId}`} render={this.renderList} />
          <Route exact path={`/selfassesment/list/${this.props.selfAssesmentId}/:id`} render={this.renderResponse} />
        </Switch>
      </div>
    )
  }
}

SelfAssesmentListPage.propTypes = {
  selfAssesmentId: PropTypes.number.isRequired,
  selfAssesment: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  translate: PropTypes.func.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string
  }).isRequired
}

SelfAssesmentListPage.defaultProps = {
  selfAssesment: {
    name: ''
  }
}

const mapStateToProps = (state, ownProps) => ({
  selfAssesment: state.instance.self_assessments.find(sa => sa.id === ownProps.selfAssesmentId),
  user: state.user
})

export default withLocalize(withRouter(connect(mapStateToProps, null)(SelfAssesmentListPage)))
