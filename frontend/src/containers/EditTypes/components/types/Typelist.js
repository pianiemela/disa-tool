import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './types.css'

import Type from './Type'
import CreateTypeForm from './CreateTypeForm'

export const Typelist = props => (
  <div className="Typelist">
    <div />{/* This div is here on purpose.
    The first element inside the parent div gets displaced for css reasons.
    This is a sacrificial div to deal with that bug. */}
    {props.types.map(type => (<Type
      key={type.id}
      type={type}
      editing={props.editing}
      courseId={props.courseId}
    />))}
    {props.editing ? (
      <CreateTypeForm courseId={props.courseId} />
    ) : (
      null
    )}
  </div>
)

Typelist.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
  types: state.type.types
})

export default connect(mapStateToProps, null)(Typelist)
