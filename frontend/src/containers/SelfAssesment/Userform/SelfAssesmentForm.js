import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button, Loader, Container, Message } from 'semantic-ui-react'
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
  createSelfAssessmentResponseAction
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
          responseText: []
        }
      }
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
        this.props.dispatchInitNewFormAction({ courseData: courseData.data, courseInfo: courseInfo.data.data, type })
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

  clearError = async (types) => {
    const newE = { ...this.state.responseErrors }
    const { type, errorType, id } = types

    if (type === 'qModErrors' ||  'openQErrors') {
      newE[type][errorType] = newE[type][errorType].filter(error => error.id !== id)
    }

    if (type === 'finalGErrors') {
      newE[type][errorType] = []
    }

    this.setState({ responseErrors: newE })
  }

  checkResponseErrors = async () => {
    const { questionModuleResponses, openQuestionResponses, finalGradeResponse } = this.props.assesmentResponse
    let fGrade = []
    let fResponse = []
    const grade = questionModuleResponses.filter(qm => !qm.grade)
    const responseText = questionModuleResponses.filter(qm => qm.responseText === '')
    fGrade = !finalGradeResponse.grade ? [...fGrade, finalGradeResponse] : []
    fResponse = finalGradeResponse.responseText === '' ? [...fResponse, finalGradeResponse] : []
    const openQErrors = openQuestionResponses.filter(oq => oq.responseText === '')

    if (grade.length > 0 || responseText.length > 0 || fGrade.lenght > 0 || fResponse.length > 0 || openQErrors.length > 0) {
      await this.setState({
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
            responseText: fResponse
          },
          qModErrors: { ...this.state.responseErrors.qModErrors, grade, responseText }
        }
      })
      return true
    }
    return false
  }

  handleResponse = async () => {
    console.log('nanigh')
    const e = await this.checkResponseErrors()
    if (e) {
      return
    }
    const { assesmentResponse } = this.props
    try {
      this.setState({ redirect: true })
      await this.props.dispatchCreateSelfAssesmentResponseAction(assesmentResponse)
    } catch (error) {
      console.log(error)
    }
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
    if (this.state.redirect) {
      return <Redirect to="/user" />
    }
    const renderForm = () => {
      let submitFunction = null
      const { formData, edit } = this.props
      const { structure } = formData
      const { displayCoursename, type, formInfo } = structure
      const { openQ, questionHeaders, grade } = structure.headers
      const { responseErrors } = this.state

      if (this.props.assesmentResponse.existingAnswer) {
        return (<UserResultsPage
          assesmentResponse={this.props.assesmentResponse}
          formInfo={this.props.formData}
        />)
      }
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
            {edit ?
              <Button
                green
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
                QuestionModule={CategoryQuestionModule}
                errors={responseErrors.qModErrors}
                clearError={this.clearError}
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
              />
              :
              null
            }

            {structure.finalGrade.includedInAssesment || (edit && !this.state.preview) ?
              <SelfAssesmentSection
                headers={grade}
                formData={[structure.finalGrade]}
                edit={edit ? !this.state.preview : false}
                QuestionModule={CategoryQuestionModule}
                final
                headerType="grade"
                changedProp={dummyPropToEnsureChange}
                errors={this.state.responseErrors.finalGErrors}
                clearError={this.clearError}
              />
              :
              null}

            {this.state.preview ?
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
          Object.keys(this.props.formData).length > 0 ?
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
  assesmentResponse: state.selfAssesment.assesmentResponse
})

const mapDispatchToProps = dispatch => ({
  dispatchCreateFormAction: data =>
    dispatch(createForm(data)),

  dispatchUpdateSelfAssesmentAction: data =>
    dispatch(updateSelfAssesmentAction(data)),

  dispatchGetSelfAssesmentAction: selfAssesmentId =>
    dispatch(getSelfAssesmentAction(selfAssesmentId)),

  dispatchGetCourseInstanceDataAction: courseInstanceId =>
    dispatch(getCourseInstanceDataAction(courseInstanceId)),

  dispatchInitNewFormAction: data =>
    dispatch(initNewFormAction(data)),

  dispatchEditFormAction: data =>
    dispatch(editFormAction(data)),

  dispatchGetAssesmentResponseAction: selfAssesmentId =>
    dispatch(getAssesmentResponseAction(selfAssesmentId)),

  dispatchCreateSelfAssesmentResponseAction: data =>
    dispatch(createSelfAssessmentResponseAction(data))
})

SelfAssesmentForm.defaultProps = {
  formData: {} || []
}


SelfAssesmentForm.propTypes = {
  formData: PropTypes.shape(),
  edit: PropTypes.bool.isRequired,
  dispatchCreateFormAction: PropTypes.func.isRequired,
  dispatchUpdateSelfAssesmentAction: PropTypes.func.isRequired,
  new: PropTypes.bool.isRequired,
  dispatchInitNewFormAction: PropTypes.func.isRequired,
  dispatchGetAssesmentResponseAction: PropTypes.func.isRequired,
  dispatchGetSelfAssesmentAction: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({}).isRequired
  }).isRequired,
  dispatchCreateSelfAssesmentResponseAction: PropTypes.func.isRequired,
  assesmentResponse: PropTypes.shape({
    existingAnswer: PropTypes.bool
  }).isRequired

}

export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentForm)
