import React from 'react'
import { Container } from 'semantic-ui-react'
import SelfAssesmentCreateForm from './CreateForm/SelfAssesmentCreateForm'
import { getCourseData } from './services/createForm'

export class SelfAssesmentPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { mockUser: 'ope' }
  }

  componentWillMount() {
    this.setState({ courseAssesmentData: getCourseData() })
  }

  renderTeacherView = () => (
    <SelfAssesmentCreateForm data={this.state.courseAssesmentData} />
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

export default SelfAssesmentPage
