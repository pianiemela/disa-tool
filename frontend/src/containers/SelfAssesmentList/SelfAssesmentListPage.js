import React, { Component } from 'react'
import { number, string, arrayOf, shape, func } from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Link, Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { Container, Loader, Button, Icon, Segment, Header } from 'semantic-ui-react'

import { getResponsesBySelfAssesment, updateVerificationAndFeedback, getSelfAssesment } from '../../api/selfassesment'
import FeedbackPage from '../Feedback/FeedbackPage'
import LinkExport from '../User/components/LinkExport'
import ResponseList from './components/ResponseList'
import SelectionButtons from './components/SelectionButtons'
import SelfAssesmentCSVDownload from './components/SelfAssesmentCSVDownload'
import { init, regenerate } from './actions/selfAssesmentList'
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
      <Container>
        { updating ? this.renderUpdating() : undefined }
        <SelectionButtons />
        {this.state.loading ? (
          <Loader active />
        ) : (
          <div>
            <ResponseList
              header={this.translate('selected_header')}
              subheader={`${selectedResponses.length} / ${responses.length}`}
              responses={selectedResponses}
              selected
            />
            <ResponseList
              header={this.translate('non-selected_header')}
              responses={notSelected}
            />
          </div>
        )}
      </Container>
    )
  }

  renderResponse = () => {
    const { activeResponse, selfAssesmentId } = this.props
    if (activeResponse === null) return <Redirect to={`/selfassessment/list/${selfAssesmentId}`} />
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
            <h2 style={{ flexGrow: 1 }}>{activeResponse.person.name}</h2>
          </div>
        </Container>
        <FeedbackPage
          assessmentResponse={activeResponse.response}
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
              <LinkExport style={{ flexShrink: 1 }} title={`${this.translate('link')}: `} url={`/selfassesment/response/${this.props.selfAssesmentId}`} />
            </Segment>
            <Segment>
              <Header style={{ whiteSpace: 'nowrap', marginRight: '80px' }}>{this.props.selfAssesmentName}</Header>
              <Button
                basic
                color="blue"
                content={this.translate('generate_feedback')}
                onClick={this.regenarateFeedback}
              />
              <SelfAssesmentCSVDownload />
            </Segment>
          </Segment.Group>
        </Container>
        <Switch>
          <Route exact path={`/selfassessment/list/${this.props.selfAssesmentId}`} render={this.renderList} />
          <Route exact path={`/selfassessment/list/${this.props.selfAssesmentId}/:id`} render={this.renderResponse} />
        </Switch>
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
  dispatchRegenerate: regenerate(dispatch)
})

export default withLocalize((
  withRouter((
    connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentListPage)
  ))
))
