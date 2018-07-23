import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeLevel } from '../../services/levels'

import ModalForm from '../../../../utils/components/ModalForm'

export class RemoveLevelForm extends Component {
  removeLevel = () => {
    this.props.removeLevel({
      id: this.props.level.id
    })
  }

  render() {
    const contentPrompt = [
      'Poistetaanko oppimistaso',
      `"${this.props.level.name}"`
    ].join(' ')
    return (
      <div className="RemoveLevelForm">
        <ModalForm
          header="Poista oppimistaso"
          trigger={<Button color="red" icon={{ name: 'delete' }} size="small" />}
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

RemoveLevelForm.propTypes = {
  level: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  removeLevel: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeLevel: asyncAction(removeLevel, dispatch)
})

export default connect(null, mapDispatchToProps)(RemoveLevelForm)
