import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeType } from '../../services/types'

import ModalForm from '../../../../utils/components/ModalForm'

class RemoveTypeForm extends Component {
  removeType = () => {
    this.props.removeType({
      typeId: this.props.type.id
    })
  }

  render() {
    return (
      <div className="removeTypeForm">
        <ModalForm
          header="placeholder text"
          trigger={<Button icon={{ name: 'delete' }} color="red" size="small" />}
          content={
            <div>
              <p>PLACEHOLDER: Remove {this.props.type.name}</p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeType}>
                  {'<delete>'}
                </Button>
                <Button>
                  {'<cancel>'}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

RemoveTypeForm.propTypes = {
  removeType: PropTypes.func.isRequired,
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps
})

const mapDispatchToProps = dispatch => ({
  removeType: asyncAction(removeType, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoveTypeForm)
