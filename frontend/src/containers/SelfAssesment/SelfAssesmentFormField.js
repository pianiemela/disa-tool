import React, { Component } from 'react'
import { SelfAssesmentForm } from './SelfAssesmentForm';
import { Grid } from 'semantic-ui-react'


export class SelfAssesmentFormField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        const { formFieldData } = this.props
        console.log(formFieldData)
    }

    render() {
        return (
            <Grid.Row>
                <Grid.Column>
                    <p>{this.props.formFieldData}</p>
                </Grid.Column>
                <Grid.Column>
                    <p>arvosana ja persustelut</p>
                </Grid.Column>
            </Grid.Row>
        )
    }
}