import React from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Grid, Header } from 'semantic-ui-react'

import LoginForm from '../Login/components/form/LoginForm'

export const HomePage = props => (
  <Grid container>
    <Grid.Row>
      <Grid.Column>
        <Header as="h1">{props.translate('Home.HomePage.header1')}</Header>
        <p>
          <span>{props.translate('Home.HomePage.introduction')} </span>
          <a href="mailto:grp-toska@helsinki.fi">{props.translate('Home.HomePage.developers')}</a>.
        </p>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={5}>
        {props.translate('Home.HomePage.log_in_prompt')}:
        <LoginForm />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <p>{props.translate('Home.HomePage.anon_info')}</p>

        <Header as="h2" content={props.translate('Home.HomePage.student_header')} />
        <p>{props.translate('Home.HomePage.student_info')}</p>

        <Header as="h2" content={props.translate('Home.HomePage.teacher_header')} />
        <p>{props.translate('Home.HomePage.teacher_info')}</p>

        <Header as="h2" content={props.translate('Home.HomePage.background_header')} />
        <p>
          <span>{props.translate('Home.HomePage.background_info_1_1')}</span>
          <a href={props.translate('Home.HomePage.background_link_1_href')}>
            {props.translate('Home.HomePage.background_link_1')}
          </a>
          <span>{props.translate('Home.HomePage.background_info_1_2')}</span>
        </p>
        <p>
          <span>{props.translate('Home.HomePage.background_info_2_1')}</span>
          <a href={props.translate('Home.HomePage.background_link_2_1')}>(HYPE)</a>
          <span>{props.translate('Home.HomePage.background_info_2_2')}</span>
          <a href={props.translate('Home.HomePage.background_link_2_2_href')}>{props.translate('Home.HomePage.background_link_2_2')}</a>.
          <span>{props.translate('Home.HomePage.background_info_2_3')}</span>
        </p>
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

HomePage.propTypes = {
  translate: PropTypes.func.isRequired
}

export default withLocalize(HomePage)
