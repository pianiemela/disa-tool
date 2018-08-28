import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { renderToStaticMarkup } from 'react-dom/server'
import translation from '../../translation.json'

class LocalizeWrapper extends PureComponent {
  constructor(props) {
    super(props)

    this.props.initialize({
      languages: [
        { name: 'English', code: 'eng' },
        { name: 'Suomi', code: 'fin' },
        { name: 'Svenska', code: 'swe' }
      ],
      translation,
      options: { renderToStaticMarkup }
    })
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

LocalizeWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  initialize: PropTypes.func.isRequired
}

export default withLocalize(LocalizeWrapper)
