import React, { Component } from 'react'
import { Container, Button } from 'semantic-ui-react'
import SelfAssesmentForm from './Userform/SelfAssesmentForm'
import SelfAssesmentCreateForm from './CreateForm/SelfAssesmentCreateForm'
import { getCourseParts, getSelfAssesmentData } from './services/createForm'
export class SelfAssesmentPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { courseParts: {}, mockUser: 'ope' }
    }

    componentWillMount() {
        this.setState({ courseParts: getCourseParts(), courseAssesmentData: getSelfAssesmentData() })
    }

    renderTeacherView = () => {
        return<SelfAssesmentCreateForm data={this.state.courseAssesmentData}></SelfAssesmentCreateForm>
    }


    render() {
        const { courseParts } = this.state
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