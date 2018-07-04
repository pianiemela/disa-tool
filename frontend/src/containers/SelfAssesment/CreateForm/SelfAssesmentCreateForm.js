import React, { Component } from 'react'
import { CategoryFormAccordion } from './CategoryFormAccordion';
import { ObjectiveFormAccordion } from './ObjectiveFormAccordion'
import { Accordion, TransitionablePortaln, Icon, Form, Button } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'
import { connect } from 'react-redux'

import { getSelfAssesmentData } from '../services/createForm'
import { createFormJSONStucture } from '../reducers/createFormReducer'


export class SelfAssesmentCreateForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: [], selectedView: '' }
    }

    componentWillMount() {
        this.props.getSelfAssesmentData()
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        let { active } = this.state
        const opened = active.includes(index) ? active = active.filter(i => i !== index) : active.concat(index)
        this.setState({ active: opened })
    }

    toggleButton = (e) => {
        const { value } = e.target
        this.setState({ selectedView: value })
    }

    // renderCategoryForm = () => {
    //     {
    //         let course_instance_objectives = []
    //         this.props.courseData.courseInstance ? { course_instance_objectives } = this.props.formData.courseInstance
    //             : course_instance_objectives = []
    //         const { active, selectedView } = this.state
    //         return course_instance_objectives.map(ciO =>
    //             <CategoryFormAccordion key={ciO.id} active={active.includes(ciO.id)} handleClick={this.handleClick} props={ciO} />
    //         )
    //     }
    // }

    // renderObjectiveform = () => {
    //     let course_instance_objectives = []
    //     this.props.c.courseInstance ? { course_instance_objectives } = this.props.formData.courseInstance
    //         : course_instance_objectives = []
    //     const { active, selectedView } = this.state

    //     return course_instance_objectives.map(ciO =>
    //         <ObjectiveFormAccordion key={ciO.id} acthtive={active.includes(ciO.id)} handleClick={this.handleClick} props={ciO} />
    //     )
    // }

    createForm = () => {
        let parsedData = {}
        const { courseInstance } = this.props.courseData
        parsedData['fin_name'] = courseInstance.fin_name
        parsedData['swe_name'] = courseInstance.fin_name
        parsedData['eng_name'] = courseInstance.fin_name
        parsedData['type'] = this.state.selectedView
        if (parsedData['type'] === 'category') {
            parsedData['questionModules'] = []
            courseInstance.course_instance_objectives.map(ciO =>
                parsedData['questionModules'].push({
                    id: ciO.id, fin_name: ciO.category, swe_name: ciO.category, eng_name: ciO.category, textFieldOn: true,
                })
            )
        } else {
            parsedData['questionModules'] = []
            courseInstance.course_instance_objectives.map(ciO =>
                parsedData['questionModules'].push({
                    id: ciO.id, fin_name: ciO.category, swe_name: ciO.category, eng_name: ciO.category,
                    objectives: ciO.objectives.map(o => ({ 'fin_name': o, 'swe_name': o, 'eng_name': o })),
                    answers: ['osaan huonosti', 'osaan keskinkertaisesti', 'osaan hyvin']
                })
            )

        }
        this.props.createFormJSONStucture({parsedData })
    }

    render() {

        const { selectedView } = this.state
        const category = 'category'
        const objectives = 'objectives'
        console.log(this.props)

        return (
            <div>
                <Form onSubmit={this.createForm}>
                    <Form.Field>
                        <Button type="button" value={category} active={category === selectedView} toggle onClick={this.toggleButton}>Itsearviolomake kategorioiden pohjalta</Button>
                        <Button type="button" value={objectives} active={objectives === selectedView} toggle onClick={this.toggleButton}>Itsearviolomake tavoitteiden pohjalta</Button>
                        {/* <Accordion styled exclusive={false} >
                        {selectedView === 'category' ?
                            this.renderCategoryForm() :
                            this.renderObjectiveform()}
                    </Accordion> */}
                    </Form.Field>
                    <Button style={{ marginLeft: '250px' }} type="submit">Luo</Button>
                </Form>



            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        courseData: state.createForm.courseData,
        category: state.createForm.category,
        objectives: state.createForm.objectives

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getSelfAssesmentData: asyncAction(getSelfAssesmentData, dispatch),
        createFormJSONStucture: (createFormJSONStucture(dispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentCreateForm)
