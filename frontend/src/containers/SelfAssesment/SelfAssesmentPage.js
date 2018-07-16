import React from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
    const courseInfo = this.props.courses.find(cd => cd.id === courseId)
    this.props.dispatchCreateForm({ courseData, type, courseInfo })
    this.setState({ created: true })
  }

  handleSubmit = async () => {
    const { formData } = this.props
    console.log(formData)
  }

  renderTeacherView = () => (
    <SelfAssesmentCreateForm
      courses={this.props.courses}
      dropDownCourse={this.props.dropDownOptions}
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
    selfAssesments: state.selfAssesments,
    dropDownOptions: createOptions(state.courses),
    formData: state.selfAssesmentCreate
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchCreateForm: data =>
    dispatch(initCreateForm(data))
})

SelfAssesmentForm.defaultProps = {
  formData: {} || []
}

SelfAssesmentPage.propTypes = {
  dropDownOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formData: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()]).isRequired,
  dispatchCreateForm: PropTypes.func.isRequired,
  courses: PropTypes.PropTypes.arrayOf(PropTypes.shape()).isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentPage)
