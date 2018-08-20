import React from 'react'
import { Grid, Header } from 'semantic-ui-react'

import LoginForm from '../Login/components/form/LoginForm'

export const HomePage = () => (
  <Grid container>
    <Grid.Row>
      <Grid.Column>
        <Header as="h1">Tervetuloa DISA-työkaluun</Header>
        <p>
        DISA-työkalun avulla opettajat ja opiskelijat voivat luoda ja tarkastella kurssin
        osaamistavoitteita sekä arvioida ja seurata näiden tavoitteiden toteutumista. Sovellus
        on vasta työn alla ja kokeilukäytössä, joten vikoja voi tulla vastaan. Näistä voi ilmoittaa
        kurssien opettajille tai suoraan <a href="mailto:grp-toska@helsinki.fi"> kehittäjille</a>.
        </p>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={5}>
        Kirjaudu sisään Helsingin yliopiston tunnuksilla:
        <LoginForm />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <p>
      Kirjautumattomana voit selata kursseja ja tarkastella niiden osaamistavoitteita.
        </p>

        <Header as="h2" content="Opiskelijalle" />
        <p>
      Kirjautuneena pääset rekisteröitymään kursseille. Kun olet rekisteröitynyt,
      pääset katselemaan tehtäväsuorituksiasi ja vastaamaan kurssin itsearviointeihin.
        </p>

        <Header as="h2" content="Opettajalle" />
        <p>
      Jos haluat käyttää työkalua kurssillasi, pyydä pääkäyttäjää lisäämään sinut opettajaksi.
      Tämän jälkeen voit luoda kurssillesi tavoitteita ja tehtäviä. Voit myös tarkkailla
      opiskelijoiden edistymistä ja teettää heillä itsearviointeja.
        </p>

        <Header as="h2" content="Taustaa" />
        <p>
      DISA-työkalu on saanut alkunsa matematiikan ja tilastotieteen laitoksella tehtävästä
          <a href="https://tuhat.helsinki.fi/portal/fi/projects/digital-selfassessm(384b2b6c-1992-48cd-aa60-0e9169c2efe9).html"> itsearviointitutkimuksesta</a>.
      Tutkimuksessa on havaittu, että osaamistavoitematriiseilla sekä itsearviointiharjoituksilla
      on myönteistä vaikutusta opiskelijoiden oppimisstrategioihin, motivaatioon ja käsitykseen
      omasta osaamisestaan.
        </p>

        <p>
      Tutkimuksessa ovat mukana Helsingin yliopiston yliopistopedagogiikan keskus
          <a href="https://www.helsinki.fi/fi/yliopistopedagogiikan-keskus-hype">(HYPE) </a>
      sekä <a href="https://www.helsinki.fi/fi/kasvatustieteellinen-tiedekunta">kasvatustieteellinen tiedekunta</a>.
      Työkalua kehittää Helsingin yliopiston tietojenkäsittelytieteen osaston
      TOSKA-ohjelmistonkehitysakatemia Helsingin yliopiston tukemana.
        </p>
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default HomePage
