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
              formData={this.props.formData}
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
