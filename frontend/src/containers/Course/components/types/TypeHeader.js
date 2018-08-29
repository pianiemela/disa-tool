import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Segment, Header } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeHeader } from '../../actions/types'

import Typelist from './Typelist'
import DeleteForm from '../../../../utils/components/DeleteForm'
import EditHeaderForm from './EditHeaderForm'

export const TypeHeader = (props) => {
  const activeMap = {}
  if (props.activeTask !== null) {
    props.activeTask.types.forEach((type) => {
      activeMap[type] = true
    })
  }
  const translate = id => props.translate(`Course.types.TypeHeader.${id}`)

  return (
    <div className="TypeHeader">
      <Segment>
        <div className="flexContainer">
          <Header className="typeHeaderHeader">{props.header.name}</Header>
          {props.editing ? (
            <div className="flexContainer">
              <div className="paddedBlock">
                <EditHeaderForm headerId={props.header.id} />
              </div>
              <div className="paddedBlock">
                <DeleteForm
                  onExecute={() => props.removeHeader({ id: props.header.id })}
                  prompt={[
                    translate('delete_prompt_1'),
                    `"${props.header.name}"`
                  ]}
                  header={translate('delete_header')}
                />
              </div>
            </div>
          ) : null}
        </div>
        <Typelist
          types={props.header.types}
          editing={props.editing}
          headerId={props.header.id}
          activeTaskId={props.activeTask === null ? null : props.activeTask.id}
          activeMap={activeMap}
        />
      </Segment>
    </div>
  )
}

TypeHeader.propTypes = {
  header: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeHeader: PropTypes.func.isRequired,
  activeTask: PropTypes.shape({
    id: PropTypes.number.isRequired,
    types: PropTypes.arrayOf(PropTypes.number).isRequired
  }),
  translate: PropTypes.func.isRequired
}

TypeHeader.defaultProps = {
  activeTask: null
}

const mapDispatchToProps = dispatch => ({
  removeHeader: asyncAction(removeHeader, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(TypeHeader))
