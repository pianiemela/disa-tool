import React from 'react'
import { Container, Header } from 'semantic-ui-react'

export const HomePage = () => (
  <Container>
    <Header as="h1">Tervetuloa DISA-työkaluun</Header>
    <p>
      Jos olet sivulla ensimmäistä kertaa, haluat todennäköisesti ensin kirjautua sisään.
      Kirjautumatta voit yhä selata kursseja ja katsella niiden tavoitematriiseja.
    </p>
    <p>
      Kirjautumisen jälkeen voit kurssien selaamisen yhteydessä myös rekisteröityä menossa oleville
      kursseille. Tällöin kurssi lisätään omalle sivullesi ja voit sitä kautta käydä katsomassa
      kurssin tehtäväsuorituksiasi ja vastata kurssilla oleviin itsearviointeihin.
    </p>
    <p>
      Sovellus on edelleen vahvasti työn alla, joten kummallisuuksia ja vikoja voi tulla vastaan.
      Näistä voi ilmoittaa kurssien opettajille tai suoraan
      <a href="mailto:grp-toska@helsinki.fi"> kehittäjille.</a>
    </p>
  </Container>
)

export default HomePage
