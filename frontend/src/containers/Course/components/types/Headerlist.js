import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import './types.css'
import TypeHeader from './TypeHeader'
import CreateHeaderForm from './CreateHeaderForm'

export const Headerlist = (props) => {
  const headers = props.headers.sort((a, b) => a.order - b.order)
  let newOrder = 1
  const headersNode = headers.map((header, index, headersArray) => {
    const slots = {
      previous: index > 0 ? (header.order + headersArray[index - 1].order) / 2 : header.order - 1,
      next: index < headersArray.length - 1 ? (
        (header.order + headersArray[index + 1].order) / 2
      ) : header.order + 1
    }
    if (index === headersArray.length - 1) { newOrder = slots.next }
    return (
      <TypeHeader
        key={header.id}
        header={header}
        editing={props.editing}
        courseId={props.courseId}
        activeTask={props.activeTask}
        slots={slots}
      />
    )
  })
  return (
    <div className="Headerlist">
      {headersNode}
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
