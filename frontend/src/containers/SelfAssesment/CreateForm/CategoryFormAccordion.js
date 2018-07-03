import React, { Component } from 'react'
import { Accordion, Icon, Checkbox } from 'semantic-ui-react'
export class CategoryFormAccordion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        console.log(this.props)
    }

    render() {
        const { category, id } = this.props.props
        const { active } = this.props
        const { selectedView } = this.props

        return (
            <div>

                <Accordion.Title active={active} index={id} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    {category}
                </Accordion.Title>

                <Accordion.Content active={active}>
                    <Checkbox label='Sisällytä perustelut kenttä' />
                </Accordion.Content>



            </div>
        )
    }

}
export default CategoryFormAccordion