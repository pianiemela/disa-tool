import React, { Component } from 'react'
import { SelfAssesmentFormField } from './SelfAssesmentFormField'

export class SelfAssesmentForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {
  }

    render() {
        const { courseParts } = this.props

        return (
            <div>
                {Object.keys(courseParts).map(formFieldData =>
                    <SelfAssesmentFormField formFieldData={formFieldData}></SelfAssesmentFormField>
                )}
            </div>
        )
    }
}


export default SelfAssesmentForm