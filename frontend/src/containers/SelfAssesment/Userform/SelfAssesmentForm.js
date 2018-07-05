import React, { Component } from 'react'
import { SelfAssesmentFormField } from './SelfAssesmentFormField'
import { Grid, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'

import ObjectiveQuestionModule  from './ObjectiveQuestionModule'
import { CategoryQuestionModule } from './CategoryQuestionModule'

export class SelfAssesmentForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {
        console.log(this.props)
    }

    renderEditableForm = () => {
        if (this.props.justCreated) {
            if (Object.keys(this.props.objectives).length !== 0) {
                const { objectives } = this.props
                console.log(objectives)
                return <div>
                    <h2>{objectives.fin_name} tavoitelomake</h2>
                    <Form>
                        {objectives.questionModules.map(questionModules =>
                            <ObjectiveQuestionModule data={questionModules} edit={true}></ObjectiveQuestionModule>
                        )}
                    </Form>
                </div>
            }
            if (Object.keys(this.props.category).length !== 0) {
                const { category } = this.props
                return <h2>{category.fin_name} kategorialomake</h2>

            }
        }
    }



    render() {
        return (
            <div>
                <p>olet nyt renderöinyt formin!</p>
                {this.renderEditableForm()}
                {/* <Grid columns={2} divided>
                    {Object.keys(courseParts).map(formFieldData =>
                        <SelfAssesmentFormField formFieldData={formFieldData}></SelfAssesmentFormField>
                    )}
                </Grid> */}
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        category: state.createForm.category,
        objectives: state.createForm.objectives

    }
}

export default connect(mapStateToProps)(SelfAssesmentForm)