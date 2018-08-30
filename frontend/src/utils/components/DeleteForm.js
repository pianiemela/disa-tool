import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'

import ModalForm from './ModalForm'

export class DeleteForm extends Component {
  removeLevel = () => {
    this.props.onExecute()
  }

  translate = id => this.props.translate(`utils.components.DeleteForm.${id}`)

  render() {
    const contentPrompt = this.props.prompt.join(' ')
    return (
      <div className="DeleteForm">
        <ModalForm
          header={this.props.header}
          trigger={<Button negative basic circular icon={{ name: 'delete' }} size="mini" />}
          content={
            <div>
              <p>{contentPrompt}?</p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeLevel}>{this.translate('remove')}</Button>
                <Button>{this.translate('cancel')}</Button>
              </div>
            </div>
          }
        />

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
