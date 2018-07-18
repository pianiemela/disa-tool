import React from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SelfAssesmentCreateForm from './CreateForm/SelfAssesmentCreateForm'
import { getCourseData } from './services/createForm'
import SelfAssesmentForm from './Userform/SelfAssesmentForm'

import { initForm, createForm, getUserCoursesAction, getUserSelfAssesments } from '../../actions/actions'

export class SelfAssesmentPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mockUser: 'ope',
      created: false
    }
  }
  async componentDidMount() {
    this.props.dispatchGetUsercourses()
    this.props.dispatchGetUserSelfAssesments()
  }
  createForm = async (courseId, type) => {
    const courseData = await getCourseData(courseId)
    const courseInfo = this.props.courses.find(cd => cd.id === courseId)
    this.props.dispatchInitForm({ courseData, type, courseInfo })
    this.setState({ created: true })
  }

  handleSubmit = async () => {
    const { formData } = this.props
    this.setState({ created: false })
    await this.props.dispatchCreateForm(formData)
  }

  renderTeacherView = () => (
    <SelfAssesmentCreateForm
      courses={this.props.courses}
      dropDownCourse={this.props.courseDropdownOptions}
      selfAssesments={this.props.selfAssesments}
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
    user: state.user,
    courses: state.courses,
    courseDropdownOptions: createOptions(state.courses),
    selfAssesmentDropdownOptions: createOptions(state.selfAssesment.userSelfAssesments),
    formData: state.selfAssesment.createForm,
    selfAssesments: state.selfAssesment.userSelfAssesments
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchInitForm: data =>
    dispatch(initForm(data)),
  dispatchCreateForm: data =>
    dispatch(createForm(data)),
  dispatchGetUsercourses: () =>
    dispatch(getUserCoursesAction()),
  dispatchGetUserSelfAssesments: () =>
    dispatch(getUserSelfAssesments())

})

SelfAssesmentForm.defaultProps = {
  formData: {} || []
}

SelfAssesmentPage.propTypes = {
  courseDropdownOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  // selfAssesmentDropdownOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formData: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()]).isRequired,
  dispatchCreateForm: PropTypes.func.isRequired,
  dispatchInitForm: PropTypes.func.isRequired,
  courses: PropTypes.PropTypes.arrayOf(PropTypes.shape()).isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentPage)
