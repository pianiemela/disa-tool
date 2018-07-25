import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeHeader } from '../../services/types'

import Typelist from './Typelist'
import DeleteForm from '../../../../utils/components/DeleteForm'

export const TypeHeader = props => (
  <div className="TypeHeader">
    <Segment>
      <div className="flexContainer">
        <Header className="typeHeaderHeader">{props.header.name}</Header>
        {props.editing ? (
          <DeleteForm
            onExecute={() => props.removeHeader({ id: props.header.id })}
            prompt={[
              'Poistetaanko tyyppiotsake',
              `"${props.header.name}"`
            ]}
            header="Poista tyyppiotsake"
          />
        ) : null}
      </div>
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
  editing: PropTypes.bool.isRequired,
  removeHeader: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeHeader: asyncAction(removeHeader, dispatch)
})

export default connect(null, mapDispatchToProps)(TypeHeader)
