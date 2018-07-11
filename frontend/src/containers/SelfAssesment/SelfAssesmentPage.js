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
      created: false
    }
  }

  createForm = async (courseId, type) => {
    const courseData = await getCourseData(courseId)
    this.props.dispatchCreateForm({ courseData, type })
    this.setState({ created: true })
  }

  renderTeacherView = () => (
    <SelfAssesmentCreateForm
      courses={this.props.courses}
      dropDownCourse={this.props.dropDownOptions}
      createForm={this.createForm}
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
    formdata: state.selfAssesmentCreate,
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchCreateForm: data =>
    dispatch(initCreateForm(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentPage)
