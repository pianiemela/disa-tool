import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header } from 'semantic-ui-react'

import Typelist from './Typelist'

const TypeHeader = props => (
  <div>
    <Segment>
      <Header>{props.header.name}</Header>
      <Typelist
        types={props.header.types}
        editing={props.editing}
        headerId={props.header.id}
      />
    </Segment>
  </div>
)

TypeHeader.propTypes = {
  header: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired
}

export default TypeHeader
