import React from 'react'
import { Accordion, Icon, List, Dropdown } from 'semantic-ui-react'
export class ObjectiveFormAccordion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        console.log(`are we here`)
        console.log(this.props)
    }

    render() {

        const { category, id, objectives } = this.props.props
        const { active, selectedView } = this.props
        return (
            <div>
                <Accordion.Title active={active} index={id} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    {category}
                </Accordion.Title>

                <Accordion.Content active={active} >
                <List ordered>
                        {objectives.map(o => (
                            <List.Item>{o}</List.Item>
                        ))}
                    </List>
                </Accordion.Content>

            </div>
        )
    }
}

export default ObjectiveFormAccordion   