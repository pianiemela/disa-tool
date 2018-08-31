import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'

import ModalForm from './ModalForm'

export class DeleteForm extends Component {

  translate = id => this.props.translate(`utils.components.DeleteForm.${id}`)

  render() {
    const contentPrompt = this.props.prompt.join(' ')
    return (
      <div className="DeleteForm">
        <ModalForm
          header={this.props.header}
          trigger={<Button negative basic circular icon={{ name: 'delete' }} size="mini" />}
          actions={[
            <Button negative style={{ margin: '0px 15px 0px 15px' }}>{this.translate('remove')}</Button>,
            <Button type="cancel" style={{ margin: '0px 15px 0px 15px' }}>{this.translate('cancel')}</Button>
          ]}
          onSubmit={this.props.onExecute}
        >
          <p>{contentPrompt}?</p>
        </ModalForm>

      </div>
    )
  }
}

DeleteForm.propTypes = {
  onExecute: PropTypes.func.isRequired,
  prompt: PropTypes.arrayOf(PropTypes.string).isRequired,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  translate: PropTypes.func.isRequired
}

export default withLocalize(DeleteForm)
