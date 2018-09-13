import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button, Loader, Container, Message, Modal } from 'semantic-ui-react'
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
  closeModalAction
} from './actions/selfAssesment'
import SelfAssessmentForm from './Components/SelfAssessmentForm'
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
    const { courseInstanceId, type, selfAssesmentId } = this.props.match.params
    if (this.props.edit) {
      if (this.props.new) {
        // Get assesment type and course instance id from params


        // Fetch the required data for self assesment
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
        await this.props.dispatchGetSelfAssesmentAction(selfAssesmentId)
      }
    } else {
      // Fetch the data of the self assesment
      // and fetch or create a self assesment response for the user
      await this.props.dispatchGetSelfAssesmentAction(selfAssesmentId)
      await this.props.dispatchGetAssesmentResponseAction(selfAssesmentId)
    }
    if (!this.props.role) {
      const id = courseInstanceId || this.props.formData.course_instance_id
      await this.props.dispatchGetCourseInstanceData(id)
    }
    // Fetch the grades for the course
    const grades = await gradeOptions(this.props.formData.course_instance_id)
    this.setState({ grades })
  }

  componentWillUnmount() {
    if (this.props.error) {
      this.props.dispatchClearError()
    }
    this.props.dispatchClearValidation()
  }
  handleSubmit = async () => {
    const { formData } = this.props
    this.setState({ redirect: true })
    await this.props.dispatchCreateFormAction(formData)
  }

  handleUpdate = async () => {
    const { formData } = this.props
    this.setState({ redirect: true })
    await this.props.dispatchUpdateSelfAssesmentAction(formData)
  }

  close = () => this.props.dispatchCloseModalAction()

  checkResponseErrors = async () => {
    await this.props.dispatchValidation(this.props.assesmentResponse)
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
    await this.props.dispatchCreateSelfAssesmentResponseAction({
      ...this.props.assesmentResponse,
      finalHeaders: this.props.formData.structure.headers.grade
    })
    await this.props.dispatchClearValidation()
  }

  togglePreview = () => {
    this.setState({ preview: !this.state.preview })
  }

  renderForm = () => {
    let submitFunction = null
    const { formData, edit, responseErrors } = this.props
    const { displayCoursename } = formData.structure
    const { preview, grades } = this.state
    const translate = translateId => this.props.translate(`SelfAssessmentForm.SelfAssessmentFormPage.${translateId}`)

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
          <h2 style={{ textAlign: 'center' }}>{displayCoursename}</h2>

          {this.state.preview &&
            <Message style={{ textAlign: 'center' }} color="green">{translate('previewMessage')}</Message>
          }

          {!formData.open && !edit &&
            <Message style={{ textAlign: 'center' }} color="grey">{translate('notOpenMessage')}</Message>
          }

          <Modal size="small" open={this.props.softErrors} onClose={this.close}>
            <Modal.Header>{translate('modalHeader')}</Modal.Header>
            <Modal.Content>
              <p>{translate('modalContent1')} .</p>
              <p>{translate('modalContent2')}?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => this.close()} negative>{translate('modalButton2')}</Button>
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


          {edit &&
            <Button
              color="green"
              onClick={this.togglePreview}
            >{this.state.preview ? translate('editButton') : translate('previewButton')}
            </Button>
          }

          <SelfAssessmentForm
            edit={edit}
            formData={formData}
            responseErrors={responseErrors}
            preview={preview}
            grades={grades}
          />

          {this.state.preview || (!formData.open && !edit) ?
            null
            :
            <Button
              positive
              style={{ marginBottom: '25px' }}
              onClick={submitFunction}
            >
              {!this.props.edit || this.props.new ? translate('saveButton') : translate('updateButton')}
            </Button>
          }
        </Container>
      </div>
    )
  }


  render() {
    if (this.state.redirect || this.props.error ||
      ((this.props.new || this.props.edit) && this.props.notTeacher)) {
      return <Redirect to="/user" />
    }

    if (this.props.assesmentResponse.existingAnswer) {
      return (
        <FeedbackPage
          assessmentResponse={this.props.assesmentResponse}
          assessmentInfo={this.props.formData}
        />)
    }

    return (
      <div>
        {
          Object.keys(this.props.formData).length > 0 && this.props.role ?
            this.renderForm()
            :
            <Loader active>Loading</Loader>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.selfAssesment.createForm,
  courseInstance: state.instance,
  assesmentResponse: state.selfAssesment.assesmentResponse,
  role: state.instance.courseRole,
  error: state.error.redirect,
  notTeacher: state.instance.courseRole && state.instance.courseRole !== 'TEACHER',
  responseErrors: state.validation.responseErrors,
  softErrors: state.validation.softErrors,
  formErrors: state.validation.formErrors
})

const mapDispatchToProps = dispatch => ({
  dispatchCreateFormAction: data =>
    dispatch(createForm(data)),
  dispatchUpdateSelfAssesmentAction: data =>
    dispatch(updateSelfAssesmentAction(data)),
  dispatchGetSelfAssesmentAction: selfAssesmentId =>
    dispatch(getSelfAssesmentAction(selfAssesmentId)),
  dispatchInitNewFormAction: data =>
    dispatch(initNewFormAction(data)),
  dispatchEditFormAction: data =>
    dispatch(editFormAction(data)),
  dispatchGetAssesmentResponseAction: selfAssesmentId =>
    dispatch(getAssesmentResponseAction(selfAssesmentId)),
  dispatchCreateSelfAssesmentResponseAction: (data, finalGradeHeaders) =>
    dispatch(createSelfAssessmentResponseAction(data, finalGradeHeaders)),
  dispatchToast: data =>
    dispatch(data),
  dispatchGetCourseInstanceData: courseId =>
    dispatch(getCourseInstanceDataAction(courseId)),
  dispatchClearError: () =>
    dispatch(resetErrorAction()),
  dispatchValidation: data =>
    dispatch(validationAction(data)),
  dispatchClearValidation: () =>
    dispatch(clearValidationAction()),
  dispatchCloseModalAction: () =>
    dispatch(closeModalAction())


})

SelfAssessmentFormPage.defaultProps = {
  formData: {} || [],
  new: false,
  role: null,
  notTeacher: undefined,
  softErrors: false,
  responseErrors: {}
}


SelfAssessmentFormPage.propTypes = {
  formData: PropTypes.shape(),
  new: PropTypes.bool,
  edit: PropTypes.bool.isRequired,
  dispatchCreateFormAction: PropTypes.func.isRequired,
  dispatchUpdateSelfAssesmentAction: PropTypes.func.isRequired,
  dispatchInitNewFormAction: PropTypes.func.isRequired,
  dispatchGetAssesmentResponseAction: PropTypes.func.isRequired,
  dispatchGetSelfAssesmentAction: PropTypes.func.isRequired,
  dispatchGetCourseInstanceData: PropTypes.func.isRequired,
  dispatchClearError: PropTypes.func.isRequired,
  dispatchCreateSelfAssesmentResponseAction: PropTypes.func.isRequired,
  dispatchClearValidation: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({}).isRequired
  }).isRequired,
  assesmentResponse: PropTypes.shape({
    existingAnswer: PropTypes.bool
  }).isRequired,
  dispatchToast: PropTypes.func.isRequired,
  role: PropTypes.string,
  error: PropTypes.bool.isRequired,
  notTeacher: PropTypes.bool,
  translate: PropTypes.func.isRequired,
  softErrors: PropTypes.bool,
  responseErrors: PropTypes.shape()
}

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(SelfAssessmentFormPage))
