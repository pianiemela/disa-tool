import React from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'

import SelfAssesmentCreateForm from './CreateForm/SelfAssesmentCreateForm'
import { getCourseData } from './services/createForm'
import SelfAssesmentForm from './Userform/SelfAssesmentForm'

import { initCreateForm } from '../../actions/actions'

export class SelfAssesmentPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mockUser: 'ope',
      created: false,
      formData: []
    }
  }

  createForm = async (courseId, type) => {
    const courseData = await getCourseData(courseId)
    this.props.dispatchCreateForm({ courseData, type })
    this.setState({ created: true })
  }

  handleFormChange = (formChange) => {
    const { id, type, questionData } = formChange
    const toChange = this.state.formData
    const a = toChange.questionModules.findIndex(x => x.id === id)
    const b = toChange.questionModules[a]

    switch (type) {
      case 'textfield': {
        toChange.questionModules = toChange.questionModules.map(o =>
          (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))
        this.setState({ formData: toChange })
        break
      }
      case 'changeOrderDown': {
        if (a < toChange.questionModules.length - 1) {
          toChange.questionModules[a] = toChange.questionModules[a + 1]
          toChange.questionModules[a + 1] = b
        }
        this.setState({ formData: toChange })
        break
      }
      case 'changeOrderUp': {
        if (a > 0) {
          toChange.questionModules[a] = toChange.questionModules[a - 1]
          toChange.questionModules[a - 1] = b
        }
        this.setState({ formData: toChange })
        break
      }
      case 'addQuestion': {
        if (toChange.openQuestions.length > 0) {
          toChange.openQuestions = toChange.openQuestions.concat({
            id: toChange.openQuestions[toChange.openQuestions.length - 1].id + 1,
            name: questionData
          })
        } else {
          toChange.openQuestions = toChange.openQuestions.concat({
            id: (parseInt(toChange.finalGrade.id) + 1).toString(),
            name: questionData
          })
        }
        this.setState({ formData: toChange })
        break
      }
      case 'removeQuestion': {
        toChange.openQuestions = toChange.openQuestions.filter(oQ => oQ.id !== id)
        this.setState({ formData: toChange })
        break
      }

      default:
    }
  }

  renderTeacherView = () => (
    <SelfAssesmentCreateForm
      courses={this.props.courses}
      dropDownCourse={this.props.dropDownOptions}
      getCourseData={this.getCourseData}
      createForm={this.createForm}
      handleChange={this.handleFormChange}
    />
  )


  render() {
    return (
      <Container>
        <div>
          {!this.state.created && this.state.mockUser === 'ope' ?
            this.renderTeacherView()
            :
            <SelfAssesmentForm
              edit
              created
              formData={this.props.formdata}
            />
          }
        </div>
      </Container>
    )
  }
}

const createOptions = (data) => {
  const options = []
  data.map(d =>
    options.push({ value: d.id, text: d.name }))
  return options
}
const mapStateToProps = state => (
  {
    courses: state.courses,
    selfAssesments: state.selfAssesments,
    dropDownOptions: createOptions(state.courses),
    formdata: state.selfAssesmentCreate
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchCreateForm: data =>
    dispatch(initCreateForm(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentPage)
