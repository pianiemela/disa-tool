import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'semantic-ui-react'

class ModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  expand = () => {
    this.setState({
      expanded: true
    })
  }

  collapse = () => {
    this.setState({
      expanded: false
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.onSubmit(e)
    this.collapse()
  }

  render() {
    const style = this.props.trigger.props.style || {}
    // TODO: Apply trigger margin as margin in this div.
    const trigger = (
      <div onClick={this.expand} style={{ margin: 'auto', display: 'inline-block' }}>
        {React.cloneElement(this.props.trigger, {
          style: { ...style, margin: '0px' } // We need to eliminate margin to make the div no larger than trigger.
        })}
      </div>
    )
    return (
      <Modal trigger={trigger} open={this.state.expanded} onClose={this.collapse}>
        <Modal.Header>{this.props.header}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit} loading={this.props.loading}>
            {this.props.content}
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

ModalForm.propTypes = {
  trigger: PropTypes.element.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]).isRequired,
  content: PropTypes.element.isRequired,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool
}

ModalForm.defaultProps = {
  onSubmit: () => {},
  loading: false
}

export default ModalForm
