import React from 'react'
import PropTypes from 'prop-types'
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
          <CopyToClipboard text={props.url}>
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
  url: PropTypes.string.isRequired
}

export default LinkExport
