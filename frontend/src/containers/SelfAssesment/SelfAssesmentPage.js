import React from 'react'
import { Container, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SelfAssesmentCreateForm from './CreateForm/SelfAssesmentCreateForm'
import { getCourseData } from './services/createForm'
import SelfAssesmentForm from './Userform/SelfAssesmentForm'

import { initForm, createForm } from '../../actions/actions'

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
    const courseInfo = this.props.courses.find(cd => cd.id === courseId)
    this.props.dispatchInitForm({ courseData, type, courseInfo })
    this.setState({ created: true })
  }

  handleSubmit = async () => {
    console.log('...SUBMITTING....')
    const { formData } = this.props
    this.setState({ created: false })
    await this.props.dispatchCreateForm(formData)


  }

  renderTeacherView = () => (
    <SelfAssesmentCreateForm
      courses={this.props.courses}
      dropDownCourse={this.props.courseDropdownOptions}
      createForm={this.createForm}
    />
  )

  render() {
    const { formData } = this.props
    return (
      <Container>
        <div>
          {!this.state.created && this.state.mockUser === 'ope' ?
            this.renderTeacherView()
            :
            <SelfAssesmentForm
              edit
              created
              formData={formData}
              handleSubmit={this.handleSubmit}
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
    courseDropdownOptions: createOptions(state.courses),
    selfAssesmentDropdownOptons: createOptions(state.selfAssesmentCreate.userSelfAssesments),
    formData: state.selfAssesmentCreate.createForm,
    selfAssesments: state.selfAssesmentCreate.userSelfAssesments
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchInitForm: data =>
    dispatch(initForm(data)),
  dispatchCreateForm: data =>
    dispatch(createForm(data))
})

SelfAssesmentForm.defaultProps = {
  formData: {} || []
}

SelfAssesmentPage.propTypes = {
  dropDownOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formData: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()),
  PropTypes.shape()]).isRequired,
  dispatchCreateForm: PropTypes.func.isRequired,
  courses: PropTypes.PropTypes.arrayOf(PropTypes.shape()).isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentPage)
