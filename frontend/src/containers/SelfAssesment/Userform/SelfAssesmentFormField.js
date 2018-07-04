import React, { Component } from 'react'
import { SelfAssesmentForm } from './SelfAssesmentForm';
import { Grid, Dropdown } from 'semantic-ui-react'


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
        const options = [
            { text: 1, value: 1 }, { text: 2, value: 2 }
        ]

        return (
            <Grid.Row style={{ border: 'solid', margin: "10px" }}>
                <Grid.Column>
                    <h4>Osion nimi</h4>
                    <h3>{this.props.formFieldData}</h3>
                </Grid.Column>
                <Grid.Column>
                   Arvosana
                        <span>
                            <Dropdown style={{ padding: "5px" }} options={options} />
                        </span>

                </Grid.Column>
            </Grid.Row>
        )
    }
}
export default SelfAssesmentFormField