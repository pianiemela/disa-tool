import React, { Component } from 'react'
import { SelfAssesmentForm } from './SelfAssesmentForm';


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
            <p>{this.props.formFieldData}</p>
        )
    }
}