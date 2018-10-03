import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Link, Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { Container, Loader, Accordion, Button, Icon, Table, Segment, Header } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'

import { getResponsesBySelfAssesment, updateVerificationAndFeedback } from '../../api/selfassesment'

import FeedbackPage from '../Feedback/FeedbackPage'
import LinkExport from '../User/components/LinkExport'

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

  translate = id => this.props.translate(`SelfAssessmentList.SelfAssessmentListPage.${id}`)

  regenarateFeedback = () => (
    this.setState({ loading: true }, () => {
      updateVerificationAndFeedback(this.props.selfAssesmentId).then((response) => {
        this.setState({
          responses: response.data,
          loading: false
        })
      }).catch(() => this.setState({ loading: false }))
    })
  )

  formatToCsv = () => {
    const { responses } = this.state
    const formatted = responses.map((response) => {
      const questionResponses = response.response.questionModuleResponses.map(question => (
        { [`${question.name}_text`]: question.responseText,
          [`${question.name}_grade`]: question.grade }
      ))
      const openResponses = response.response.openQuestionResponses.map(question => (
        { [`${question.name}_text`]: question.responseText }
      ))
      const { finalGradeResponse } = response.response
      const finalResponse = finalGradeResponse.name ?
        { [`${finalGradeResponse.name}_text`]: finalGradeResponse.responseText,
          [`${finalGradeResponse.name}_grade`]: finalGradeResponse.grade }
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

  renderList = () => (
    <Container>
      <Accordion
        fluid
        styled
        panels={this.state.responses.map(response => ({
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
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {response.response.questionModuleResponses.map(qmResponse => (
                      <Table.Row key={qmResponse.id}>
                        <Table.Cell>{qmResponse.name}</Table.Cell>
                        <Table.Cell textAlign="center">{qmResponse.grade}</Table.Cell>
                        <Table.Cell textAlign="center">{ /* konearvio */ }</Table.Cell>
                      </Table.Row>
                    ))}
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
                      <Table.Cell textAlign="center">{response.response.finalGradeResponse.grade}</Table.Cell>
                      <Table.Cell textAlign="center">{ /* konearvio */ }</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              ) : null}
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
    if (this.state.loading) return <Loader active />
    return (
      <div className="SelfAssesmentListPage">
        <Container>
          <Segment.Group>
            <Segment style={{ display: 'flex' }}>
              <LinkExport style={{ flexShrink: 1 }} title={`${this.translate('link')}: `} url={`/selfassesment/response/${this.props.selfAssesmentId}`} />
            </Segment>
            <Segment>
              <Header style={{ whiteSpace: 'nowrap', marginRight: '80px' }}>{this.props.selfAssesment.name}</Header>
              {this.props.user.role === 'ADMIN' ?
                <Button
                  basic
                  color="blue"
                  content={this.translate('generate_feedback')}
                  onClick={this.regenarateFeedback}
                /> : undefined }
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
