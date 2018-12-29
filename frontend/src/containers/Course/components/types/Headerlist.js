import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import './types.css'
import TypeHeader from './TypeHeader'
import CreateHeaderForm from './CreateHeaderForm'

export const Headerlist = (props) => {
  const headers = props.headers.sort((a, b) => a.order - b.order)
  let newOrder = 1
  if (headers.length > 0) {
    newOrder = headers[headers.length - 1].order + 1
  }
  return (
    <div className="Headerlist">
      {headers.map(header => (<TypeHeader
        key={header.id}
        header={header}
        editing={props.editing}
        courseId={props.courseId}
        activeTask={props.activeTask}
      />))}
      {props.editing ? (
        <CreateHeaderForm courseId={props.courseId} newOrder={newOrder} />
      ) : (
        null
      )}
    </div>
  )
}

Headerlist.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  courseId: PropTypes.number.isRequired,
  activeTask: PropTypes.shape({
    id: PropTypes.number.isRequired,
    types: PropTypes.arrayOf(PropTypes.number).isRequired
  })
}

Headerlist.defaultProps = {
  activeTask: null
}

const mapStateToProps = state => ({
  headers: state.type.headers,
  activeTask: state.task.active === null ? (
    null
  ) : (
    state.task.tasks.find(task => task.id === state.task.active)
  )
})

export default connect(mapStateToProps, null)(Headerlist)
