import React, { Component } from 'react'
import { Container, Button } from 'semantic-ui-react'
import SelfAssesmentForm from './SelfAssesmentForm'
import { getCourseParts } from './services/selfAssesmentActions'
export class SelfAssesmentPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { courseParts: {} }
    }

    componentWillMount() {
        this.setState({ courseParts: getCourseParts() })
    }


    render() {
        const { courseParts } = this.state
        console.log(courseParts)
        return (
            <Container>
                <div>
                    <h2>Itsearvio</h2>
                    <SelfAssesmentForm courseParts={courseParts}> </SelfAssesmentForm>
                </div>
            </Container>
        )
    }
}

export default SelfAssesmentPage