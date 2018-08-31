import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button, Loader, Container, Message, Modal } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import FeedbackPage from '../FeedbackPage/FeedbackPage'
import { getCourseInstance } from '../../../api/courses'
import { getCourseData } from '../../../api/categories'
import {
  getSelfAssesmentAction,
  createForm,
  updateSelfAssesmentAction,
  getCourseInstanceDataAction,
  getAssesmentResponseAction,
  createSelfAssessmentResponseAction,
  resetErrorAction
} from '../../../actions/actions'
import {
  initNewFormAction,
  editFormAction
} from '../actions/selfAssesment'

import ObjectiveQuestionModule from './FormParts/QuestionModules/ObjectiveQuestionModule'
import CategoryQuestionModule from './FormParts/QuestionModules/CategoryQuestionModule'
import OpenQuestionModule from './FormParts/QuestionModules/OpenQuestionModule'
import SelfAssessmentInfo from './FormParts/Sections/SelfAssessmentInfo'
import './selfAssesment.css'
import SelfAssessmentSection from './FormParts/Sections/SelfAssessmentSection'
import EditCategoryModule from './FormParts/QuestionModules/EditCategoryModule'
import EditObjectiveModule from './FormParts/QuestionModules/EditObjectiveModule'

import { validationErrors, gradeOptions, checkResponseErrors } from '../utils'

export class SelfAssessmentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      preview: false,
      buttonText: 'Esikatsele',
      responseErrors: {
        qModErrors:
          { grade: [], responseText: [] },
        finalGErrors:
          { grade: [], responseText: [] },
        openQErrors: {
          grade: [], responseText: []
        }
      },
      softErrors: false,
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

  clearError = (types) => {
    const newE = { ...this.state.responseErrors }
    const { type, errorType, id, objective } = types

    if (objective) {
      const toReplace = newE[type][errorType].find(e => e.id === id)
      delete toReplace.errors[objective]
      newE[type][errorType] = newE[type][errorType].map(e => (e.id === id ? toReplace : e))
    } else {
      if (type === 'qModErrors' || 'openQErrors') {
        newE[type][errorType] = newE[type][errorType].filter(error => error.id !== id)
      }

      if (type === 'finalGErrors') {
        newE[type][errorType] = []
      }
    }

    this.setState({ responseErrors: newE })
  }

  close = () => {
    this.setState({ softErrors: false })
  }

  checkResponseErrors = async () => {
    const {
      grade,
      fGrade,
      openQErrors,
      responseTextMax,
      finalResponseMax,
      responseTextMin,
      finalResponseMin }
      = checkResponseErrors(this.props.assesmentResponse)

    if (grade.length > 0
      || fGrade.length > 0
      || openQErrors.length > 0
      || responseTextMax.length > 0
      || finalResponseMax.length > 0) {
      this.setState({
        responseErrors:
        {
          ...this.state.responseErrors,
          openQErrors: {
            ...this.state.responseErrors.openQErrors,
            responseText: openQErrors
          },
          finalGErrors: {
            ...this.state.responseErrors.finalGErrors,
            grade: fGrade,
            responseText: finalResponseMax
          },
          qModErrors: {
            ...this.state.responseErrors.qModErrors,
            grade,
            responseText: responseTextMax
          }
        }
      })
      window.scrollTo(0, 0)

      await this.props.dispatchToast({
        type: '',
        payload: {
          toast: validationErrors[localStorage.getItem('lang')],
          type: 'error'
        }
      })
      return true
    }

    if (responseTextMin.length > 0 || finalResponseMin.length > 0) {
      this.setState({
        softErrors: true
      })
    } else {
      this.setState({
        softErrors: false
      })
    }
    return false
  }

  handleResponse = async () => {
    const e = await this.checkResponseErrors()

    if (e) {
      return
    }
    if (this.state.softErrors) {
      return
    }
    this.setState({ redirect: true })
    this.props.dispatchCreateSelfAssesmentResponseAction({
      ...this.props.assesmentResponse,
      finalHeaders: this.props.formData.structure.headers.grade
    })
  }

  togglePreview = () => {
    this.setState({ preview: !this.state.preview, buttonText: this.state.preview ? 'Esikatsele' : 'Muokkaa' })
  }

  render() {
    const translate = translateId => this.props.translate(`SelfAssessment.Userform.SelfAssessmentForm.${translateId}`)

    const dummyPropToEnsureChange = () => (
      (
        null
      )
    )
    if (this.state.redirect || this.props.error ||
      ((this.props.new || this.props.edit) && this.props.roleError)) {
      return <Redirect to="/user" />
    }
    if (this.props.assesmentResponse.existingAnswer) {
      return (
        <FeedbackPage
          assessmentResponse={this.props.assesmentResponse}
          assessmentInfo={this.props.formData}
        />)
    }

    const renderForm = () => {
      let submitFunction = null
      const { formData, edit } = this.props
      const { structure } = formData
      const { displayCoursename, type } = structure
      const { grade } = structure.headers
      const { responseErrors } = this.state

      if (!edit) {
        submitFunction = this.handleResponse
      } else if (this.props.new) {
        submitFunction = this.handleSubmit
      } else {
        submitFunction = this.handleUpdate
      }

      return (
        <div>
          <Container className="selfAssessmentForm">
            <h2 style={{ textAlign: 'center' }}>{displayCoursename}</h2>
            {this.state.preview ?
              <Message style={{ textAlign: 'center' }} color="green">{translate('previewMessage')}</Message>
              :
              null
            }
            {!formData.open && !edit ?
              <Message style={{ textAlign: 'center' }} color="grey">{this.props.translate('notOpenMessage')}</Message>
              :
              null
            }

            <Modal size="small" open={this.state.softErrors} onClose={this.close}>
              <Modal.Header>{translate('modalHeader')}</Modal.Header>
              <Modal.Content>
                <p>{translate('modalContent1')} .</p>
                <p>{translate('modalContent2')}?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.close()} negative>{translate('modalButton2')}</Button>
                <Button
                  onClick={() => {
                    this.props.dispatchCreateSelfAssesmentResponseAction({
                      ...this.props.assesmentResponse,
                      finalHeaders: structure.headers.grade
                    })
                    this.setState({
                      redirect: true,
                      softErrors: false
                    })
                  }}
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content={translate('modalButton1')}
                />
              </Modal.Actions>
            </Modal>


            {edit ?
              <Button
                color="green"
                onClick={() => this.togglePreview()}
              >{this.state.buttonText}
              </Button>
              :
              null
            }

            <SelfAssessmentInfo
              formData={formData}
              edit={edit ? !this.state.preview : false}
            />

            {type === 'category' ?
              <SelfAssessmentSection
                name={structure.questionModuleName}
                formData={structure.questionModules}
                edit={edit ? !this.state.preview : false}
                changedProp={dummyPropToEnsureChange}
                QuestionModule={(edit && !this.state.preview)
                  ?
                  EditCategoryModule
                  :
                  CategoryQuestionModule}
                courseInstanceId={formData.course_instance_id}
                errors={responseErrors.qModErrors}
                clearError={this.clearError}
                grades={this.state.grades}
              />

              :

              <SelfAssessmentSection
                name={structure.questionModuleName}
                formData={structure.questionModules}
                edit={edit ? !this.state.preview : false}
                changedProp={dummyPropToEnsureChange}
                QuestionModule={(edit && !this.state.preview)
                  ?
                  EditObjectiveModule
                  :
                  ObjectiveQuestionModule}
                errors={responseErrors.qModErrors}
                clearError={this.clearError}
              />
            }

            {structure.openQuestions.questions.length > 0 || (edit && !this.state.preview) ?
              <SelfAssessmentSection
                name={structure.openQuestions.name}
                formData={structure.openQuestions.questions}
                edit={edit ? !this.state.preview : false}
                changedProp={dummyPropToEnsureChange}
                QuestionModule={OpenQuestionModule}
                question
                errors={responseErrors.openQErrors}
                clearError={this.clearError}
              />
              :
              null
            }

            {structure.finalGrade.includedInAssesment || (edit && !this.state.preview) ?
              <SelfAssessmentSection
                headers={grade}
                formData={[structure.finalGrade]}
                edit={edit ? !this.state.preview : false}
                QuestionModule={(edit && !this.state.preview)
                  ?
                  EditCategoryModule
                  :
                  CategoryQuestionModule}
                final
                headerType="grade"
                courseInstanceId={formData.course_instance_id}
                changedProp={dummyPropToEnsureChange}
                errors={responseErrors.finalGErrors}
                clearError={this.clearError}
                grades={this.state.grades}
              />
              :
              null}

            {this.state.preview || (!formData.open && !edit) ?
              null
              :
              <Button
                positive
                style={{ marginBottom: '25px' }}
                onClick={submitFunction}
              >
                {!this.props.edit || this.props.new ? 'Tallenna' : 'Päivitä'}
              </Button>
            }
          </Container>
        </div >

      )
    }
    return (
      <div>
        {
          Object.keys(this.props.formData).length > 0 && this.props.role ?
            renderForm()
            :
            <Loader active>Loading</Loader>
        }
      </div >
    )
  }
}

const mapStateToProps = state => ({
  formData: state.selfAssesment.createForm,
  courseInstance: state.instance,
  assesmentResponse: state.selfAssesment.assesmentResponse,
  role: state.instance.courseRole,
  error: state.error.redirect,
  roleError: state.instance.courseRole && state.instance.courseRole !== 'TEACHER'
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
    dispatch(resetErrorAction())

})

SelfAssessmentForm.defaultProps = {
  formData: {} || [],
  new: false,
  role: null,
  roleError: undefined
}


SelfAssessmentForm.propTypes = {
  formData: PropTypes.shape(),
  edit: PropTypes.bool.isRequired,
  dispatchCreateFormAction: PropTypes.func.isRequired,
  dispatchUpdateSelfAssesmentAction: PropTypes.func.isRequired,
  new: PropTypes.bool,
  dispatchInitNewFormAction: PropTypes.func.isRequired,
  dispatchGetAssesmentResponseAction: PropTypes.func.isRequired,
  dispatchGetSelfAssesmentAction: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({}).isRequired
  }).isRequired,
  dispatchCreateSelfAssesmentResponseAction: PropTypes.func.isRequired,
  assesmentResponse: PropTypes.shape({
    existingAnswer: PropTypes.bool
  }).isRequired,
  dispatchToast: PropTypes.func.isRequired,
  role: PropTypes.string,
  dispatchGetCourseInstanceData: PropTypes.func.isRequired,
  dispatchClearError: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  roleError: PropTypes.bool,
  translate: PropTypes.func.isRequired
}

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(SelfAssessmentForm))
