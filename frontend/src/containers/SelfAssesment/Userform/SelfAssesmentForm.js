import React from 'react'
import { connect } from 'react-redux'
import { Form, Grid, Button, Loader } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import ObjectiveQuestionModule from './FormParts/QuestionModules/ObjectiveQuestionModule'
import CategoryQuestionModule from './FormParts/QuestionModules/CategoryQuestionModule'
import OpenQuestionModule from './FormParts/QuestionModules/OpenQuestionModule'
import SelfAssesmentInfo from './FormParts/Sections/SelfAssesmentInfo'
import './selfAssesment.css'
import SelfAssesmentSection from './FormParts/Sections/SelfAssesmentSection'
import { getSelfAssesmentAction } from '../../../actions/actions'


class SelfAssesmentForm extends React.Component {

  async componentDidMount() {
    if (!this.props.created) {
      const { selfAssesmentId } = this.props.match.params
      await this.props.dispatchGetSelfAssesmentAction(selfAssesmentId)
    }
  }
  render() {
    console.log(`rerender`)
    const textArea = (label, placeholder, textFieldOn, checkbox) => (
      (
        <Grid.Column>
          <Form.TextArea
            disabled={!textFieldOn}
            label={label}
            placeholder={placeholder}
          />
          {checkbox}
        </Grid.Column>
      )
    )
    const renderEditForm = () => {
      const { formData, edit } = this.props
      const { structure } = formData
      const { displayCoursename, type, formInfo } = structure
      const { openQ, questionHeaders, grade } = structure.headers


      return (
        <div>
          <h2 style={{ textAlign: 'center' }}>{displayCoursename}</h2>

          <SelfAssesmentInfo
            textArea={textArea}
            formData={formInfo}
          />

          {type === 'category' ?
            <SelfAssesmentSection
              headers={questionHeaders}
              formData={structure.questionModules}
              edit={edit}
              textArea={textArea}
              QuestionModule={CategoryQuestionModule}
            />
            :
            <SelfAssesmentSection
              headers={questionHeaders}
              formData={structure.questionModules}
              edit={edit}
              textArea={textArea}
              QuestionModule={ObjectiveQuestionModule}
            />
          }

          <SelfAssesmentSection
            headers={openQ}
            formData={structure.openQuestions}
            edit={edit}
            textArea={textArea}
            QuestionModule={OpenQuestionModule}
            question
          />

          {type === 'category' ?

            <SelfAssesmentSection
              headers={grade}
              formData={[structure.finalGrade]}
              edit={edit}
              textArea={textArea}
              QuestionModule={CategoryQuestionModule}
              final
              headerType="grade"
            />
            :
            null
          }
          <Button
            positive
            style={{ marginBottom: '25px' }}
          // onClick={handleSubmit}
          >
            {/* {bText} */}
          </Button>

        </div>
      )
    }
    return (
      <div>
        {this.props.edit && Object.keys(this.props.formData).length > 0 ?
          renderEditForm()
          :
          <Loader active>Loading</Loader>
        }
      </div >
    )
  }
}

const mapStateToProps = state => ({
  formData: state.selfAssesment.createForm
})

const mapDispatchToProps = dispatch => ({
  dispatchGetSelfAssesmentAction: id =>
    dispatch(getSelfAssesmentAction(id))
})

// SelfAssesmentForm.defaultProps = {
//   selfAssesment: state.selfAssesment
// }

SelfAssesmentForm.propTypes = {
  // formData: PropTypes.shape(),
  edit: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  bText: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentForm)
