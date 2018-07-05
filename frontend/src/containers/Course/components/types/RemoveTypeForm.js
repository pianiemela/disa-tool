import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeType } from '../../services/types'

class RemoveTypeForm extends Component {
  removeType = () => {
    this.props.removeType({
      typeId: this.props.id
    })
  }

  render() {
    return (
      <div className="removeTypeForm">
        <Button onClick={this.removeType} icon={{ name: 'delete' }} color="red" size="small" />
      </div>
    )
  }
}

RemoveTypeForm.propTypes = {
  removeType: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps
})

const mapDispatchToProps = dispatch => ({
  removeType: asyncAction(removeType, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoveTypeForm)
