import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './types.css'

import TypeHeader from './TypeHeader'
import CreateHeaderForm from './CreateHeaderForm'

export const Headerlist = props => (
  <div className="Headerlist">
    {props.headers.map(header => (<TypeHeader
      key={header.id}
      header={header}
      editing={props.editing}
      courseId={props.courseId}
    />))}
    {props.editing ? (
      <CreateHeaderForm courseId={props.courseId} />
    ) : (
      null
    )}
  </div>
)

Headerlist.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
  headers: state.type.headers
})

export default connect(mapStateToProps, null)(Headerlist)
