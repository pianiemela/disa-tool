import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Prompt } from 'react-router'
import { Link } from 'react-router-dom'
import {
  Button,
  Loader,
  Container,
  Modal,
  Header,
  Segment
} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import FeedbackPage from '../Feedback/FeedbackPage'
import { getCourseInstance } from '../../api/courses'
import { getCourseData } from '../../api/categories'
import {
  getSelfAssesmentAction,
  createForm,
  updateSelfAssesmentAction,
  getCourseInstanceDataAction,
  getAssesmentResponseAction,
  createSelfAssessmentResponseAction,
  resetErrorAction
} from '../../actions/actions'
import {
  initNewFormAction,
  editFormAction,
  validationAction,
  clearValidationAction,
  closeModalAction,
  clearAssessmentAction
} from './actions/selfAssesment'
import SelfAssessmentForm from './Components/SelfAssessmentForm'
import AssessmentMessage from './Components/AssessmentMessage'
import './Components/selfAssesment.css'

import { validationErrors, gradeOptions } from './utils'

export class SelfAssessmentFormPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      preview: false,
      grades: []
    }
  }

  async componentDidMount() {
    const { courseInstanceId, type, selfAssessmentId } = this.props.match.params
    if (this.props.edit) {
      if (this.props.new) {
        // Get assessment type and course instance id from params

        // Fetch the required data for self assessment
        // courseData includes all objectives and categories related to course
        // course info includes the names in eng, fin and swe

        const courseData = await getCourseData(courseInstanceId)
        const courseInfo = await getCourseInstance(courseInstanceId)

        // dispatch the call to reducer to generate the required form data with given parameters
        this.props.dispatchInitNewFormAction({
          courseData: courseData.data,
          courseInfo: courseInfo.data.data,
          type
        })
      } else {
        // Fetch the selfassesment data by given id
        await this.props.dispatchGetSelfAssessmentAction(selfAssessmentId)
      }
    } else {
      // Fetch the data of the self assessment
      // and fetch or create a self assessment response for the user
      await this.props.dispatchGetSelfAssessmentAction(selfAssessmentId)
      await this.props.dispatchGetAssessmentResponseAction(selfAssessmentId)
    }
    if (!this.props.role) {
      const id = courseInstanceId || this.props.formData.course_instance_id
      await this.props.dispatchGetCourseInstanceData(id)
    }

    if (this.props.formData) {
      // Fetch the grades for the course
      const grades = await gradeOptions(this.props.formData.course_instance_id)
      this.setState({ grades })
    } else {
      this.props.dispatchToast({
        type: '',
        payload: {
          toast: this.props.translate('SelfAssessmentForm.SelfAssessmentFormPage.defineMatrixFirstError'),
          type: 'error'
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.props.error) {
      this.props.dispatchClearError()
    }
    this.props.dispatchClearValidation()
    this.props.dispatchClearAssessmentAction()
  }
  handleSubmit = async () => {
    const { formData } = this.props
    this.setState({ redirect: true })
    await this.props.dispatchCreateFormAction(formData)
  }

  handleUpdate = async () => {
    const { formData } = this.props
    this.setState({ redirect: true })
    await this.props.dispatchUpdateSelfAssessmentAction(formData)
  }

  close = () => this.props.dispatchCloseModalAction()

  checkResponseErrors = async () => {
    await this.props.dispatchValidation(this.props.assessmentResponse)
    window.scrollTo(0, 0)
    if (this.props.formErrors) {
      await this.props.dispatchToast({
        type: '',
        payload: {
          toast: validationErrors[localStorage.getItem('lang')],
          type: 'error'
        }
      })
      return true
    }
    return false
  }

  handleResponse = async (e, { modal }) => {
    const error = await this.checkResponseErrors()

    if (error) {
      return
    }

    if (this.props.softErrors && !modal) {
      return
    }
    this.setState({ redirect: true })
    await this.props.dispatchCreateSelfAssessmentResponseAction({
      ...this.props.assessmentResponse,
      finalHeaders: this.props.formData.structure.headers.grade
    })
    await this.props.dispatchClearValidation()
  }

  togglePreview = () => {
    this.setState({ preview: !this.state.preview })
  }

  renderForm = () => {
    let submitFunction = null
    const { formData, edit, responseErrors, assessmentResponse } = this.props
    const { existingAnswer } = assessmentResponse
    const { displayCoursename } = formData.structure
    const { preview, grades } = this.state
    const translate = (translateId) =>
      this.props.translate(
        `SelfAssessmentForm.SelfAssessmentFormPage.${translateId}`
      )

    if (!edit) {
      submitFunction = this.handleResponse
    } else if (this.props.new) {
      submitFunction = this.handleSubmit
    } else {
      submitFunction = this.handleUpdate
    }
    return (
      <div>
        <Container className="SelfAssessmentFormPage">
          <Segment>
            <Header as="h1" textAlign="center">
              <Button
                as={Link}
                to={`/user/course/${this.props.courseInstance.id}`}
                basic
                floated="left"
                color="blue"
                icon="backward"
                content={translate('back_button')}
              />
              {displayCoursename}
            </Header>
          </Segment>

          <AssessmentMessage
            preview={this.state.preview}
            open={formData.open}
            edit={edit}
            existingAnswer={existingAnswer}
            translate={translate}
          />

          <Modal size="small" open={this.props.softErrors} onClose={this.close}>
            <Modal.Header>{translate('modalHeader')}</Modal.Header>
            <Modal.Content>
              <p>{translate('modalContent1')} .</p>
              <p>{translate('modalContent2')}?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => this.close()} negative>
                {translate('modalButton2')}
              </Button>
              <Button
                onClick={this.handleResponse}
                positive
                modal="modal"
                icon="checkmark"
                labelPosition="right"
                content={translate('modalButton1')}
              />
            </Modal.Actions>
          </Modal>

          {edit && (
            <Button color="teal" onClick={this.togglePreview}>
              {this.state.preview
                ? translate('editButton')
                : translate('previewButton')}
            </Button>
          )}
          {this.state.preview || (!formData.open && !edit) ? null : (
            <Button
              positive
              style={{ marginBottom: '25px' }}
              onClick={submitFunction}
            >
              {!this.props.edit || this.props.new
                ? translate('saveButton')
                : translate('updateButton')}
            </Button>
          )}

          <SelfAssessmentForm
            edit={edit}
            formData={formData}
            responseErrors={responseErrors}
            preview={preview}
            grades={grades}
            existingAnswer={assessmentResponse}
          />

          {edit && (
            <Button color="teal" onClick={this.togglePreview}>
              {this.state.preview
                ? translate('editButton')
                : translate('previewButton')}
            </Button>
          )}
          {this.state.preview || (!formData.open && !edit) ? null : (
            <Button
              positive
              style={{ marginBottom: '25px' }}
              onClick={submitFunction}
            >
              {!this.props.edit || this.props.new
                ? translate('saveButton')
                : translate('updateButton')}
            </Button>
          )}
        </Container>
      </div>
    )
  }

  render() {
    const { courseInstanceId } = this.props.match.params
    if (
      this.state.redirect ||
      this.props.error ||
      ((this.props.new || this.props.edit) && this.props.notTeacher)
    ) {
      return <Redirect to="/user" />
    }

    if (
      this.props.assessmentResponse.existingAnswer &&
      !this.props.formData.open
    ) {
      return (
        <FeedbackPage
          assessmentResponse={this.props.assessmentResponse}
          assessmentInfo={this.props.formData}
        />
      )
    }

    const renderContent = () => {
      if (!this.props.formData) {
        return <Redirect to={`/user/course/${courseInstanceId}`} />
      }
      if (Object.keys(this.props.formData).length > 0 && (Object.keys(this.props.assessmentResponse).length > 0 || this.props.edit) && this.props.role) {
        return this.renderForm()
      }
      return <Loader active>Loading</Loader>
    }

    return (
      <div>
        <Prompt
          when={this.props.unsavedChanges}
          message={this.props.translate(
            'SelfAssessmentForm.SelfAssessmentFormPage.prompt'
          )}
        />
        {renderContent()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  formData: state.selfAssesment.createForm,
  courseInstance: state.instance,
  assessmentResponse: state.selfAssesment.assesmentResponse,
  role: state.instance.courseRole,
  error: state.error.redirect,
  notTeacher:
    state.instance.courseRole && state.instance.courseRole !== 'TEACHER',
  responseErrors: state.validation.responseErrors,
  softErrors: state.validation.softErrors,
  formErrors: state.validation.formErrors,
  unsavedChanges: state.selfAssesment.unsavedFormChanges
})

const mapDispatchToProps = (dispatch) => ({
  dispatchCreateFormAction: (data) => dispatch(createForm(data)),
  dispatchUpdateSelfAssessmentAction: (data) =>
    dispatch(updateSelfAssesmentAction(data)),
  dispatchGetSelfAssessmentAction: (selfAssessmentId) =>
    dispatch(getSelfAssesmentAction(selfAssessmentId)),
  dispatchInitNewFormAction: (data) => dispatch(initNewFormAction(data)),
  dispatchEditFormAction: (data) => dispatch(editFormAction(data)),
  dispatchGetAssessmentResponseAction: (selfAssessmentId) =>
    dispatch(getAssesmentResponseAction(selfAssessmentId)),
  dispatchCreateSelfAssessmentResponseAction: (data, finalGradeHeaders) =>
    dispatch(createSelfAssessmentResponseAction(data, finalGradeHeaders)),
  dispatchToast: (data) => dispatch(data),
  dispatchGetCourseInstanceData: (courseId) =>
    dispatch(getCourseInstanceDataAction(courseId)),
  dispatchClearError: () => dispatch(resetErrorAction()),
  dispatchValidation: (data) => dispatch(validationAction(data)),
  dispatchClearValidation: () => dispatch(clearValidationAction()),
  dispatchCloseModalAction: () => dispatch(closeModalAction()),
  dispatchClearAssessmentAction: () => dispatch(clearAssessmentAction())
})

SelfAssessmentFormPage.defaultProps = {
  formData: {} || [],
  new: false,
  role: null,
  notTeacher: undefined,
  softErrors: false,
  responseErrors: {},
  formErrors: false
}

SelfAssessmentFormPage.propTypes = {
  formData: PropTypes.shape(),
  new: PropTypes.bool,
  edit: PropTypes.bool.isRequired,
  dispatchCreateFormAction: PropTypes.func.isRequired,
  dispatchUpdateSelfAssessmentAction: PropTypes.func.isRequired,
  dispatchInitNewFormAction: PropTypes.func.isRequired,
  dispatchGetAssessmentResponseAction: PropTypes.func.isRequired,
  dispatchGetSelfAssessmentAction: PropTypes.func.isRequired,
  dispatchGetCourseInstanceData: PropTypes.func.isRequired,
  dispatchClearError: PropTypes.func.isRequired,
  dispatchCreateSelfAssessmentResponseAction: PropTypes.func.isRequired,
  dispatchClearValidation: PropTypes.func.isRequired,
  dispatchCloseModalAction: PropTypes.func.isRequired,
  dispatchClearAssessmentAction: PropTypes.func.isRequired,
  dispatchValidation: PropTypes.func.isRequired,
  formErrors: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseInstanceId: PropTypes.string,
      type: PropTypes.string,
      selfAssessmentId: PropTypes.string
    }).isRequired
  }).isRequired,
  assessmentResponse: PropTypes.shape({
    existingAnswer: PropTypes.bool
  }).isRequired,
  dispatchToast: PropTypes.func.isRequired,
  role: PropTypes.string,
  error: PropTypes.bool.isRequired,
  notTeacher: PropTypes.bool,
  translate: PropTypes.func.isRequired,
  softErrors: PropTypes.bool,
  responseErrors: PropTypes.shape(),
  unsavedChanges: PropTypes.bool.isRequired,
  courseInstance: PropTypes.shape({ id: PropTypes.number }).isRequired
}

export default withLocalize(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SelfAssessmentFormPage)
)
