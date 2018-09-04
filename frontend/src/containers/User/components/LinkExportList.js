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

  translate = id => this.props.translate(`UserPage.CourseInfo.Links.${id}`)

  renderCollapsed = () => (
    <Button
      onClick={() => this.setState({ expanded: true })}
      basic
      color="blue"
      content={this.translate('course_links')}
      style={{ whiteSpace: 'nowrap' }}
    />
  )

  renderExpanded = () => (
    <div>
      <Button
        onClick={() => this.setState({ expanded: false })}
        basic
        color="blue"
        content={this.translate('close')}
      />
      <Segment>
        <LinkExport
          title={this.translate('registration')}
          url={`/courses?course=${this.props.course.course_id}&instance=${this.props.course.id}`}
        />
        <LinkExport
          title={this.translate('matrix')}
          url={`/courses/matrix/${this.props.course.id}`}
        />
        <LinkExport
          title={this.translate('course_page')}
          url={`/user/course/${this.props.course.id}`}
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
  }).isRequired,
  translate: PropTypes.func.isRequired
}

export default withLocalize(LinkExportList)
