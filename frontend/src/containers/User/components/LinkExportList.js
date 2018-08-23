import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Button } from 'semantic-ui-react'

import LinkExport from './LinkExport'

const BASE_URL = 'localhost:8080'

class LinkExportList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  renderCollapsed = () => (
    <Button
      onClick={() => this.setState({ expanded: true })}
      basic
      color="blue"
      content="Kurssin linkit"
      style={{ whiteSpace: 'nowrap' }}
    />
  )

  renderExpanded = () => (
    <div>
      <Button
        onClick={() => this.setState({ expanded: false })}
        basic
        color="blue"
        content="Sulje"
      />
      <Segment>
        <LinkExport title="Rekisteröityminen: " url={`${BASE_URL}/courses?course=${this.props.course.course_id}&instance=${this.props.course.id}`} />
        <LinkExport title="Matriisi: " url={`${BASE_URL}/course/matrix/${this.props.course.id}`} />
      </Segment>
    </div>
  )

  render() {
    return (
      <div className="LinkExportList">
        {this.state.expanded ? this.renderExpanded() : this.renderCollapsed()}
      </div>
    )
  }
}

LinkExportList.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course_id: PropTypes.number.isRequired
  }).isRequired
}

export default LinkExportList
