import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Popup, Grid } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const LinkExport = props => (
  <div className="LinkExport">
    <Grid>
      <Grid.Row>
        <Grid.Column width={6}>
          <strong>{props.title}</strong>
        </Grid.Column>
        <Grid.Column width={9}>
          <span>{props.url}</span>
        </Grid.Column>
        <Grid.Column width={1}>
          <CopyToClipboard text={props.url} onCopy={props.linkToast}>
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
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
)

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
