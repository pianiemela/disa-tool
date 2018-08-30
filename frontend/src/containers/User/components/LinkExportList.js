import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Button } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

import LinkExport from './LinkExport'

class LinkExportList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  t = id => this.props.translate(`UserPage.CourseInfo.Links.${id}`)

  renderCollapsed = () => (
    <Button
      onClick={() => this.setState({ expanded: true })}
      basic
      color="blue"
      content={this.t('course_links')}
      style={{ whiteSpace: 'nowrap' }}
    />
  )

  renderExpanded = () => (
    <div>
      <Button
        onClick={() => this.setState({ expanded: false })}
        basic
        color="blue"
        content={this.t('close')}
      />
      <Segment>
        <LinkExport
          title={this.t('registration')}
          url={`/courses?course=${this.props.course.course_id}&instance=${this.props.course.id}`}
        />
        <LinkExport
          title={this.t('matrix')}
          url={`/courses/matrix/${this.props.course.id}`}
        />
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

export default withLocalize(LinkExportList)
