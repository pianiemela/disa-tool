import React, { Component } from 'react'
import { Container, Button } from 'semantic-ui-react'
import SelfAssesmentForm from './SelfAssesmentForm'
export class SelfAssesment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
    }


    render() {
        const { courseData } = this.props
        return (
            <Container>
                <div>
                    <h2>Itsearvio</h2>
                    <SelfAssesmentForm courseParts={courseData}> </SelfAssesmentForm>
                </div>
            </Container>
        )
    }
}

export default SelfAssesment