import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LocalizeProvider } from 'react-localize-redux'
import { Modal, Form } from 'semantic-ui-react'

import LocalizeWrapper from '../../containers/Localize/LocalizeWrapper'

class ModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
    if (this.props.children && this.props.content) {
      console.error('Both props children and content defined in ModalForm. content will not be rendered.')
    }
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.expanded === null) {
      if (!oldState.expanded && this.state.expanded) this.props.onOpen()
    } else if (!oldState.expanded && this.props.expanded) this.props.onOpen()
  }

  expand = () => {
    this.setState({
      expanded: true
    })
  }

  collapse = () => {
    this.props.onClose()
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
    // The children/content are wrapped in a separate context.
    // This is a hack and should be fixed to use the outside context instead.
    return (
      <Modal
        trigger={trigger}
        open={this.props.expanded === null ? this.state.expanded : this.props.expanded}
        onClose={this.collapse}
      >
        <Modal.Header>{this.props.header}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit} loading={this.props.loading}>
            <LocalizeProvider>
              <LocalizeWrapper>
                {this.props.children || this.props.content}
              </LocalizeWrapper>
            </LocalizeProvider>
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
  content: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  expanded: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func
}

ModalForm.defaultProps = {
  onSubmit: () => {},
  loading: false,
  expanded: null,
  onClose: () => {},
  onOpen: () => {},
  content: null,
  children: null
}

export default ModalForm
