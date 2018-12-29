import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Segment, Header } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import { removeHeader, moveHeader } from '../../actions/types'
import Typelist from './Typelist'
import DeleteForm from '../../../../utils/components/DeleteForm'
import EditHeaderForm from './EditHeaderForm'
import dndItem from '../../../../utils/components/DnDItem'

const DnDItem = dndItem('type_header')

export const TypeHeader = (props) => {
  const {
    header,
    activeTask,
    editing
  } = props
  const activeMap = {}
  if (activeTask !== null) {
    activeTask.types.forEach((type) => {
      activeMap[type] = true
    })
  }
  const translate = id => props.translate(`Course.types.TypeHeader.${id}`)

  return (
    <DnDItem element={header} mover={props.moveHeader}>
      <Segment>
        <div className="flexContainer">
          <Header className="typeHeaderHeader">{header.name}</Header>
          {props.editing ? (
            <div className="flexContainer">
              <div className="paddedBlock">
                <EditHeaderForm headerId={header.id} />
              </div>
              <div className="paddedBlock">
                <DeleteForm
                  onExecute={() => props.removeHeader({ id: header.id })}
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
          types={header.types}
          editing={editing}
          headerId={header.id}
          activeTaskId={props.activeTask === null ? null : activeTask.id}
          activeMap={activeMap}
        />
      </Segment>
    </DnDItem>
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
  translate: PropTypes.func.isRequired,
  moveHeader: PropTypes.func.isRequired
}

TypeHeader.defaultProps = {
  activeTask: null
}

const mapDispatchToProps = dispatch => ({
  removeHeader: asyncAction(removeHeader, dispatch),
  moveHeader: moveHeader(dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(TypeHeader))
