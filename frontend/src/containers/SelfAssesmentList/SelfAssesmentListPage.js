import React, { Component, Fragment } from 'react'
import { number, string, arrayOf, shape, func } from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Link, Switch, Route, withRouter } from 'react-router-dom'
import { Container, Loader, Button, Icon, Segment, Header, Table } from 'semantic-ui-react'

import { getResponsesBySelfAssesment, updateVerificationAndFeedback, getSelfAssesment } from '../../api/selfassesment'
import FeedbackPage from '../Feedback/FeedbackPage'
import LinkExport from '../User/components/LinkExport'
import ResponseList from './components/ResponseList'
import { init, regenerate, reset } from './actions/selfAssesmentList'
import { responseProp } from './propTypes'

class SelfAssesmentListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      updating: false,
      successful: 0,
      unSuccessful: 0
    }
  }

  async componentDidMount() {
    const [responsesResponse, selfAssesmentResponse] = await Promise.all([
      getResponsesBySelfAssesment({ id: this.props.selfAssesmentId }),
      getSelfAssesment(this.props.selfAssesmentId)
    ])
    this.props.dispatchInit({
      responses: responsesResponse.data.data,
      selfAssesmentId: selfAssesmentResponse.data.data.id,
      selfAssesmentName: selfAssesmentResponse.data.data.name
    })
    this.setState({
      loading: false
    })
  }

  componentWillUnmount() {
    this.props.dispatchReset()
  }

  translate = id => this.props.translate(`SelfAssessmentList.SelfAssessmentListPage.${id}`)

  regenarateFeedback = async () => {
    await this.setState({ loading: true, updating: true, successful: 0, unSuccessful: 0 })
    const newSelected = (await Promise.all(this.props.selectedResponses.map(async (resp) => {
      try {
        const response = await updateVerificationAndFeedback(resp.id)
        await this.setState({
          successful: this.state.successful + 1
        })
        return response.data
      } catch (e) {
        await this.setState({
          unSuccessful: this.state.unSuccessful + 1
        })
        return null
      }
    }))).filter(response => response !== null)
    this.props.dispatchRegenerate(newSelected)
    this.setState({ loading: false, updating: false })
  }

  renderUpdating = () => (
    <Segment> success: {this.state.successful}, fail: {this.state.unSuccessful} </Segment>
  )

  renderList = () => {
    const { updating } = this.state
    const { responses, selectedResponses } = this.props
    const notSelected = responses.filter(r => !selectedResponses.find(sr => sr === r))
    return (
      <Fragment>
        { updating ? this.renderUpdating() : null }
        {this.state.loading ? (
          <Loader active />
        ) : (
          <Fragment>
            <ResponseList
              header={this.translate('selected_header')}
              subheader={`${selectedResponses.length} / ${responses.length}`}
              responses={selectedResponses}
              selected
              regenarateFeedback={this.regenarateFeedback}
            />
            <ResponseList
              header={this.translate('non-selected_header')}
              responses={notSelected}
            />
          </Fragment>
        )}
      </Fragment>
    )
  }

  renderResponse = (props) => {
    const { activeResponse, selfAssesmentId, responses, selectedResponses } = this.props
    const paramId = Number(props.match.params.id)
    const foundActiveResponse = activeResponse || responses.find(e => e.id === paramId)
    if (foundActiveResponse == null) return <Loader active />
    const backButton = (
      <Button as={Link} to={`/selfassessment/list/${selfAssesmentId}`} basic>
        <Icon name="angle double left" />
        <span>{this.translate('back')}</span>
      </Button>
    )
    return (
      <div>
        <Container textAlign="center">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            {backButton}
            <h2 style={{ flexGrow: 1 }}>{foundActiveResponse.person.name}</h2>
          </div>
        </Container>
        <FeedbackPage
          assessmentResponse={foundActiveResponse.response}
          teacher
        />
        <Container>
          {backButton}
        </Container>
      </div>
    )
  }

  render() {
    return (
      <div className="SelfAssesmentListPage">
        <Container>
          <Segment.Group>
            <Segment style={{ display: 'flex' }}>
              <Table>
                <Table.Body>
                  <LinkExport style={{ flexShrink: 1 }} title={`${this.translate('link')}: `} url={`/selfassessment/response/${this.props.selfAssesmentId}`} />
                </Table.Body>
              </Table>
            </Segment>
            <Segment>
              <Header style={{ whiteSpace: 'nowrap', marginRight: '80px' }}>{this.props.selfAssesmentName}</Header>
            </Segment>
          </Segment.Group>
          <Switch>
            <Route exact path={`/selfassessment/list/${this.props.selfAssesmentId}`} render={this.renderList} />
            <Route exact path={`/selfassessment/list/${this.props.selfAssesmentId}/:id`} render={this.renderResponse} />
          </Switch>
        </Container>
      </div>
    )
  }
}

SelfAssesmentListPage.propTypes = {
  selfAssesmentId: number.isRequired,
  selfAssesmentName: string,
  translate: func.isRequired,
  responses: arrayOf(responseProp).isRequired,
  selectedResponses: arrayOf(shape({})).isRequired,
  dispatchInit: func.isRequired,
  dispatchRegenerate: func.isRequired,
  dispatchReset: func.isRequired,
  activeResponse: responseProp
}

SelfAssesmentListPage.defaultProps = {
  selfAssesmentName: '',
  activeResponse: null
}

const mapStateToProps = state => ({
  selfAssesmentName: state.selfAssesmentList.selfAssesmentName,
  selectedResponses: state.selfAssesmentList.selectedResponses,
  responses: state.selfAssesmentList.responses,
  activeResponse: state.selfAssesmentList.activeResponse
})

const mapDispatchToProps = dispatch => ({
  dispatchInit: init(dispatch),
  dispatchRegenerate: regenerate(dispatch),
  dispatchReset: reset(dispatch)
})

export default withLocalize((
  withRouter((
    connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentListPage)
  ))
))
