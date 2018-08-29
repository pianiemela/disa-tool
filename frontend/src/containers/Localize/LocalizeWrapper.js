import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { renderToStaticMarkup } from 'react-dom/server'

import translation from '../../translation.json'
import { getLanguage } from '../../utils/utils'

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
      options: {
        renderToStaticMarkup,
        onMissingTranslation: this.missingTranslationHandler
      }
    })
  }

  componentDidMount() {
    const code = getLanguage()
    this.props.setActiveLanguage(code || 'fin')
  }

  missingTranslationHandler = ({ translationId }) => {
    // Recursively look through tree structure in translation.json for "common" translations
    // in nodes below until the root or a suitable translation is reached.
    const path = translationId.split('.')
    switch (path.length) {
      case 1:
        return `missing translation: ${translationId}`
      case 2:
        if (path[0] === 'common') return `missing translation: ${path[1]}`
        path[0] = 'common'
        break
      default:
        if (path[path.length - 2] === 'common') path.splice(path.length - 3, 1)
        else path[path.length - 2] = 'common'
    }
    return this.props.translate(path.join('.'))
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
  initialize: PropTypes.func.isRequired,
  setActiveLanguage: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

export default withLocalize(LocalizeWrapper)
