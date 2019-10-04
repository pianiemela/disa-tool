import React from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Grid, Header } from 'semantic-ui-react'

export const HomePage = (props) => {
  const translate = id => props.translate(`Home.HomePage.${id}`)

  return (
    <Grid container>
      <Grid.Row>
        <Grid.Column>
          <Header as="h1">{translate('header1')}</Header>
          <p>
            <span>{translate('introduction')} </span>
            <a href="mailto:grp-toska@helsinki.fi">{translate('developers')}</a>.
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2" content={translate('student_header')} />
          <p>{translate('student_info')}</p>

          <Header as="h2" content={translate('teacher_header')} />
          <p>{translate('teacher_info')}</p>

          <Header as="h2" content={translate('background_header')} />
          <p>
            <span>{translate('background_info_1_1')}</span>
            <a href={translate('background_link_1_href')}>
              {translate('background_link_1')}
            </a>
            <span>{translate('background_info_1_2')}</span>
          </p>
          <p>
            <span>{translate('background_info_2_1')}</span>
            <a href={translate('background_link_2_1')}>(HYPE)</a>
            <span>{translate('background_info_2_2')}</span>
            <a href={translate('background_link_2_2_href')}>{translate('background_link_2_2')}</a>.
            <span>{translate('background_info_2_3')}</span>
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

HomePage.propTypes = {
  translate: PropTypes.func.isRequired
}

export default withLocalize(HomePage)
