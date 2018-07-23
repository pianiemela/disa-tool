import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import ModalForm from './ModalForm'

export class DeleteForm extends Component {
  removeLevel = () => {
    this.props.onExecute()
  }

  render() {
    const contentPrompt = this.props.prompt.join(' ')
    return (
      <div className="DeleteForm">
        <ModalForm
          header={this.props.header}
          trigger={<Button negative icon={{ name: 'delete' }} size="mini" />}
          content={
            <div>
              <p>{contentPrompt}?</p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeLevel}>
                  Poista
                </Button>
                <Button>
                  Peru
                </Button>
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
  ]).isRequired
}

export default DeleteForm
