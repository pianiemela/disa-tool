import React from 'react'
import { Container } from 'semantic-ui-react'
import SelfAssesmentCreateForm from './CreateForm/SelfAssesmentCreateForm'
import { getCourseData } from './services/createForm'
import { connect } from 'react-redux'

export class SelfAssesmentPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { mockUser: 'ope' }
  }

  componentWillMount() {
    this.setState({ courseAssesmentData: getCourseData() })
  }

  renderTeacherView = () => (
    <SelfAssesmentCreateForm
      courses={this.props.courses}
      dropDownCourse={this.props.dropDownOptions}
    />
  )


  render() {
    return (
      <Container>
        <div>
          {this.state.mockUser === 'ope' ?
            this.renderTeacherView()
            :
            <h2>Itsearvio</h2>
          }
        </div>
      </Container>
    )
  }
}

const createOptions = (data) => {
  console.log('aika generoida optionssit datasta', data)
  const options = []
  data.map(d =>
    options.push({ value: d.id, text: d.name }))
  return options
}
const mapStateToProps = state => (
  {
    courses: state.courses,
    selfAssesments: state.selfAssesments,
    dropDownOptions: createOptions(state.courses)
  }
)

export default connect(mapStateToProps)(SelfAssesmentPage)
