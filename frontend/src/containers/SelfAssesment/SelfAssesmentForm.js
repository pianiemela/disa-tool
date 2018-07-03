import React, { Component } from 'react'
import { SelfAssesmentFormField } from './SelfAssesmentFormField'
import { Grid } from 'semantic-ui-react'

export class SelfAssesmentForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {
        console.log(this.props)
    }

    render() {
        const { courseParts } = this.props

        return (
            <div>
                <Grid columns={2}>
                    {Object.keys(courseParts).map(formFieldData =>
                        <SelfAssesmentFormField formFieldData={formFieldData}></SelfAssesmentFormField>
                    )}
                </Grid>
            </div >
        )
    }
}


export default SelfAssesmentForm