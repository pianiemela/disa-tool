import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeType } from '../../services/types'

import ModalForm from '../../../../utils/components/ModalForm'

export class RemoveTypeForm extends Component {
  removeType = () => {
    this.props.removeType({
      id: this.props.type.id,
      course_instance_id: this.props.courseId
    })
  }

  render() {
    const contentPrompt = [
      'Poistetaanko tyyppi',
      `"${this.props.type.name}"`
    ].join(' ')
    return (
      <div className="RemoveTypeForm">
        <ModalForm
          header="Poista tyyppi"
          trigger={<Button icon={{ name: 'delete' }} color="red" size="small" />}
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

RemoveTypeForm.propTypes = {
  removeType: PropTypes.func.isRequired,
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  courseId: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps
})

const mapDispatchToProps = dispatch => ({
  removeType: asyncAction(removeType, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoveTypeForm)
