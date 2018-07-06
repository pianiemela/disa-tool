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
    const trigger = (
      <div style={{ margin: 'auto', display: 'inline-block' }} onClick={this.expand}>
        {this.props.trigger}
      </div>
    )
    return (
      <Modal trigger={trigger} open={this.state.expanded} onClose={this.collapse}>
        <Modal.Header>{this.props.header}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
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
  onSubmit: PropTypes.func
}

ModalForm.defaultProps = {
  onSubmit: () => {}
}

export default ModalForm
