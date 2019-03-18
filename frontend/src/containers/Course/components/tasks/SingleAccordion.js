import React, { PureComponent } from 'react'
import { node } from 'prop-types'
import { Accordion, Icon } from 'semantic-ui-react'

class SingleAccordion extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { expanded: false }
  }

  toggle = () => {
    const { expanded } = this.state
    this.setState({ expanded: !expanded })
  }

  render() {
    const { title, children } = this.props
    const { expanded } = this.state
    return (
      <Accordion fluid styled>
        <Accordion.Title
          active={expanded}
          onClick={this.toggle}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ flexGrow: 1 }}>
              {title}
            </div>
            <Icon name="dropdown" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={expanded}>
          {children}
        </Accordion.Content>
      </Accordion>
    )
  }
}

SingleAccordion.propTypes = {
  title: node.isRequired,
  children: node.isRequired
}

export default SingleAccordion
