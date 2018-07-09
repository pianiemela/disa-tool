import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeTypeFromTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class DetachTypeForm extends Component {
  removeType = () => {
    this.props.removeTypeFromTask({
      taskId: this.props.task.id,
      typeId: this.props.type.id
    })
  }

  render() {
    const contentPrompt = [
      'Poistetaanko tyyppi',
      `"${this.props.type.name}"`,
      'tehtävästä',
      `"${this.props.task.name}"`
    ].join(' ')
    return (
      <div className="DetachTypeForm">
        <ModalForm
          header="Poista tyyppi tehtävästä"
          trigger={<Button color="red" icon={{ name: 'delete' }} size="small" />}
          content={
            <div>
              <p>
                {contentPrompt}?
              </p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeType}>
                  {'Poista'}
                </Button>
                <Button>
                  {'Peru'}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

DetachTypeForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  removeTypeFromTask: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeTypeFromTask: asyncAction(removeTypeFromTask, dispatch)
})

export default connect(null, mapDispatchToProps)(DetachTypeForm)
