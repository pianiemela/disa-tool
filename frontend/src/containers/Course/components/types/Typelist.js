import React, { Component } from 'react'
import { connect } from 'react-redux'
import './types.css'

import Type from './Type'

class Typelist extends Component {
  render() {
    return (
      <div className="typelist">
          <div />{/* This div is here on purpose. The first element inside the parent div gets dispalced for css reasons. This is a sacrificial div to deal with that bug. */}
          {this.props.types.map(type => <Type type={type} />)}
          {/* TODO: create add-type form. */}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    types: state.type.types
  }
}

export default connect(mapStateToProps, null)(Typelist)