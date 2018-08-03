const messages = {}

const errors = {
  privilege: {
    eng: '"Pääsy estetty." englanniksi.',
    fin: 'Pääsy estetty.',
    swe: '"Pääsy estetty." ruotsiksi.'
  },
  notfound: {
    eng: '"Haettua tietuetta ei löytynyt." englanniksi.',
    fin: 'Haettua tietuetta ei löytynyt.',
    swe: '"Haettua tietuetta ei löytynyt." ruotsiksi.'
  },
  unexpected: {
    eng: '"Yllättävä virhe tapahtui." englanniksi.',
    fin: 'Yllättävä virhe tapahtui.',
    swe: '"Yllättävä virhe tapahtui." ruotsiksi.'
  }
}

module.exports = {
  messages,
  errors
}
