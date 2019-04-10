import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Popup, Table } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export const getBaseUrl = () => {
  if (window === undefined) return ''
  return `${window.location.protocol}//${window.location.host}`
}

const LinkExport = (props) => {
  const url = `${getBaseUrl()}${props.url}`
  return (
    <Table.Row>
      <Table.Cell>
        <strong>{props.title}</strong>
      </Table.Cell>
      <Table.Cell>
        <span>{url}</span>
      </Table.Cell>
      <Table.Cell>
        <CopyToClipboard text={url} onCopy={props.linkToast}>
          <div>
            <Popup
              trigger={
                <Button
                  icon={{ name: 'copy' }}
                  size="mini"
                />
              }
              content="Kopioi leikepöydälle"
            />
          </div>
        </CopyToClipboard>
      </Table.Cell>
    </Table.Row>
  )
}

LinkExport.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]).isRequired,
  url: PropTypes.string.isRequired,
  linkToast: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  linkToast: () => dispatch({
    type: 'TOAST',
    payload: {
      type: 'message',
      toast: 'Linkki kopioitu leikepöydälle.'
    }
  })
})

export default connect(null, mapDispatchToProps)(LinkExport)
