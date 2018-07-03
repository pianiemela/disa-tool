import React, { Component } from 'react'
import { CategoryFormAccordion } from './CategoryFormAccordion';
import { ObjectiveFormAccordion } from './ObjectiveFormAccordion'
import { Accordion, TransitionablePortaln, Icon, Button } from 'semantic-ui-react'


export class SelfAssesmentCreateForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: [], selectedView: '' }
    }

    componentWillMount() {
        console.log(`are we here`)
        console.log(this.props)
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

    renderCategoryForm = () => {
        {

            const { course_instance_objectives } = this.props.data.courseInstance
            const { active, selectedView } = this.state

            return course_instance_objectives.map(ciO =>
                <CategoryFormAccordion key={ciO.id} active={active.includes(ciO.id)} handleClick={this.handleClick} props={ciO} />
            )
        }
    }

    renderObjectiveform = () => {
        const { course_instance_objectives } = this.props.data.courseInstance
        const { active, selectedView } = this.state

        return course_instance_objectives.map(ciO =>
            <ObjectiveFormAccordion key={ciO.id} active={active.includes(ciO.id)} handleClick={this.handleClick} props={ciO} />
        )
    }

    render() {

        const { selectedView } = this.state
        const category = 'category'
        const objectives = 'objectives'

        return (
            <div>
                <Button value={category} active={category === selectedView} toggle onClick={this.toggleButton}>Näytä itsearviolomake kategorioiden pohjalta</Button>
                <Button value={objectives} active={objectives === selectedView} toggle onClick={this.toggleButton}>Näytä itsearviolomake tavoitteiden pohjalta</Button>
                <Accordion styled exclusive={false} >
                    {selectedView === 'category' ?
                        this.renderCategoryForm() :
                        this.renderObjectiveform()}
                </Accordion>

            </div>
        )
    }
}

export default SelfAssesmentCreateForm
