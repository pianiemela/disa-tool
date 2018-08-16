import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import asyncAction from '../../../../utils/asyncAction'

class Grade extends Component {
  render() {
    return (
      <div className="Grade">
        <p>{this.props.grade.name}</p>
      </div>
    )
  }
}

Grade.propTypes = {
  grade: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
}

export default connect(null, null)(Grade)
