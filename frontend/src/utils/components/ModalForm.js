import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LocalizeProvider } from 'react-localize-redux'
import { Modal, Form, Divider, Button } from 'semantic-ui-react'

import LocalizeWrapper from '../../containers/Localize/LocalizeWrapper'

class ModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.expanded === null) {
      if (!oldState.expanded && this.state.expanded) this.props.onOpen()
    } else if (!oldState.expanded && this.props.expanded) this.props.onOpen()
  }

  expand = () => this.setState({ expanded: true })

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

  actionHandlers = {
    cancel: this.collapse
  }

  mapAction = (button, i) => (button.props.type ? React.cloneElement(button, {
    onClick: this.actionHandlers[button.props.type],
    key: i
  }) : React.cloneElement(button, {
    key: i
  }))

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
                {this.props.actions.length > 0 ? (
                  <div>
                    <Divider />
                    {this.props.actions.map(this.mapAction)}
                  </div>
                ) : null}
              </LocalizeWrapper>
            </LocalizeProvider>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

/**
 * Import this function, call it and pass the result as the actions prop to ModalForm.
 * Renders default "save" and "cancel buttons".
 * @param {function} translate
 */
export const saveActions = translate => [
  <Button color="green" style={{ margin: '0px 15px 0px 15px' }}>{translate('save')}</Button>,
  <Button type="cancel" style={{ margin: '0px 15px 0px 15px' }}>{translate('cancel')}</Button>
]

ModalForm.propTypes = {
  trigger: PropTypes.element.isRequired,
  header: PropTypes.node.isRequired,
  content: PropTypes.node,
  children: PropTypes.node, // children will override content if both are provided.
  actions: PropTypes.arrayOf(PropTypes.element), // Actions should be button-like elements.
  // The "type" prop of each element determines their onClick function.
  // key-props will be automatically provided to actions.
  onSubmit: PropTypes.func, // Does not override default befaviour of closing Modal.
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
  children: null,
  actions: []
}

export default ModalForm
