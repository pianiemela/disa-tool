import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button, Loader, Container, Message, Modal } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import UserResultsPage from './UserResultsPage'
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
import SelfAssesmentInfo from './FormParts/Sections/SelfAssesmentInfo'
import './selfAssesment.css'
import SelfAssesmentSection from './FormParts/Sections/SelfAssesmentSection'
import { validationErrors, gradeOptions } from '../utils'
import EditCategoryQuestionModule from './FormParts/QuestionModules/EditCategoryQuestionModule'

export class SelfAssesmentForm extends React.Component {
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
          responseText: [], grade: []
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
    const { type, errorType, id } = types

    if (type === 'qModErrors' || 'openQErrors') {
      newE[type][errorType] = newE[type][errorType].filter(error => error.id !== id)
    }

    if (type === 'finalGErrors') {
      newE[type][errorType] = []
    }

    this.setState({ responseErrors: newE })
  }
  close = () => {
    this.setState({ softErrors: false })
  }

  checkResponseErrors = async () => {
    const { questionModuleResponses, openQuestionResponses, finalGradeResponse }
      = this.props.assesmentResponse
    let fGrade = []
    let fResponse = []
    const grade = questionModuleResponses.filter(qm => !qm.grade)
    const responseText = questionModuleResponses.filter(qm => qm.responseText === '' && qm.textFieldOn)
    if (Object.keys(finalGradeResponse).length > 0) {
      fGrade = !finalGradeResponse.grade ? [...fGrade, finalGradeResponse] : []
      fResponse = finalGradeResponse.responseText === '' ? [...fResponse, finalGradeResponse] : []
    }
    const openQErrors = openQuestionResponses.length > 0 ? openQuestionResponses.filter(oq => oq.responseText === '') : []

    if (grade.length > 0 || fGrade.length > 0 || openQErrors.length > 0) {
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
            responseText: []
          },
          qModErrors: { ...this.state.responseErrors.qModErrors, grade, responseText: [] }
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
    if (responseText.length > 0 || fResponse.length > 0) {
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
    const { assesmentResponse } = this.props
    const e = await this.checkResponseErrors()

    if (e) {
      return
    }
    if (this.state.softErrors) {
      return
    }
    this.setState({ redirect: true })
    await this.props.dispatchCreateSelfAssesmentResponseAction(assesmentResponse)
  }

  togglePreview = () => {
    this.setState({ preview: !this.state.preview, buttonText: this.state.preview ? 'Esikatsele' : 'Muokkaa' })
  }

  render() {
    const dummyPropToEnsureChange = () => (
      (
        null
      )
    )
    if (this.state.redirect || this.props.error || ((this.props.new || this.props.edit) && this.props.role && this.props.role !== 'TEACHER')) {
      return <Redirect to="/user" />
    }
    if (this.props.assesmentResponse.existingAnswer) {
      return (<UserResultsPage
        assessmentResponse={this.props.assesmentResponse}
        assessmentInfo={this.props.formData}
      />)
    }
    const renderForm = () => {
      let submitFunction = null
      const { formData, edit } = this.props
      const { structure } = formData
      const { displayCoursename, type, formInfo } = structure
      const { openQ, questionHeaders, grade } = structure.headers
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
          <Container className="selfAssesmentForm">
            <h2 style={{ textAlign: 'center' }}>{displayCoursename}</h2>
            {this.state.preview ?
              <Message style={{ textAlign: 'center' }} color="green">Olet nyt esikatselutilassa, tallentaaksesi itsearvion palaa muokkaustilaan</Message>
              :
              null
            }
            {!formData.open && !edit ?
              <Message style={{ textAlign: 'center' }} color="grey">Itsearviota ei ole vielä avattu vastattavaksi.</Message>
              :
              null
            }

            <Modal size="small" open={this.state.softErrors} onClose={this.close}>
              <Modal.Header>Tallenna vastauksesi</Modal.Header>
              <Modal.Content>
                <p>Sinulla on tyhjiä perustelukenttiä vastauksille.</p>
                <p>Haluatko tallentaa vastauksen tästä huolimatta?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.close()} negative>Ei</Button>
                <Button
                  onClick={() => {
                    this.props.dispatchCreateSelfAssesmentResponseAction(
                      this.props.assesmentResponse,
                      this.props.formData.structure.headers.grade
                    )
                    this.setState({
                      redirect: true,
                      softErrors: false
                    })
                  }}
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content="Kyllä"
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

            <SelfAssesmentInfo
              formData={formInfo}
              edit={edit ? !this.state.preview : false}
            />

            {type === 'category' ?
              <SelfAssesmentSection
                headers={questionHeaders}
                formData={structure.questionModules}
                edit={edit ? !this.state.preview : false}
                changedProp={dummyPropToEnsureChange}
                QuestionModule={(edit && !this.state.preview)
                  ?
                  EditCategoryQuestionModule
                  :
                  CategoryQuestionModule}
                courseInstanceId={formData.course_instance_id}
                errors={responseErrors.qModErrors}
                clearError={this.clearError}
                grades={this.state.grades}
              />

              :

              <SelfAssesmentSection
                headers={questionHeaders}
                formData={structure.questionModules}
                edit={edit ? !this.state.preview : false}
                changedProp={dummyPropToEnsureChange}
                QuestionModule={ObjectiveQuestionModule}
                errors={responseErrors.qModErrors}
              />

            }
            {structure.openQuestions.questions.length > 0 || (edit && !this.state.preview) ?
              <SelfAssesmentSection
                headers={openQ}
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
              <SelfAssesmentSection
                headers={grade}
                formData={[structure.finalGrade]}
                edit={edit ? !this.state.preview : false}
                QuestionModule={(edit && !this.state.preview)
                  ?
                  EditCategoryQuestionModule
                  :
                  CategoryQuestionModule}
                final
                headerType="grade"
                courseInstanceId={formData.course_instance_id}
                changedProp={dummyPropToEnsureChange}
                errors={this.state.responseErrors.finalGErrors}
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
  error: state.error.redirect
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

SelfAssesmentForm.defaultProps = {
  formData: {} || [],
  new: false,
  role: null
}


SelfAssesmentForm.propTypes = {
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
  error: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentForm)
