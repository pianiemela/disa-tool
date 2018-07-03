import React, { Component } from 'react'
import { CreateFormAccordion } from './CreateFormAccordion';
import { Accordion, TransitionablePortaln, Icon, Button } from 'semantic-ui-react'


export class SelfAssesmentCreateFrom extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: [], selectedView: '' }
    }

    componentWillMount() {
        console.log(this.props)
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        let { active } = this.state
        const opened = active.includes(index) ? active = active.filter(i => i !== index) : active.concat(index)
        this.setState({ active: opened })
    }

    render() {

        const { course_instance_objectives } = this.props.data.courseInstance
        const { active } = this.state
        return (
            <div>
                <Button toggle color="green">Näytä itsearviolomake tavoitteiden pohjalta</Button>
                <Button toggle color="green">Näytä itsearviolomake kategorioiden pohjalta</Button>
                <Accordion styled exclusive={false} >
                    {course_instance_objectives.map(ciO =>
                        <CreateFormAccordion active={active.includes(ciO.id)} handleClick={this.handleClick} props={ciO} />
                    )}
                </Accordion>

            </div>
        )
    }
}

export default SelfAssesmentCreateFrom
