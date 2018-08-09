const messages = {}

const errors = {
  privilege: {
    toast: true,
    eng: '"Pääsy estetty." englanniksi.',
    fin: 'Pääsy estetty.',
    swe: '"Pääsy estetty." ruotsiksi.'
  },
  notfound: {
    toast: false,
    eng: '"Haettua tietuetta ei löytynyt." englanniksi.',
    fin: 'Haettua tietuetta ei löytynyt.',
    swe: '"Haettua tietuetta ei löytynyt." ruotsiksi.'
  },
  unexpected: {
    toast: false,
    eng: '"Yllättävä virhe tapahtui." englanniksi.',
    fin: 'Yllättävä virhe tapahtui.',
    swe: '"Yllättävä virhe tapahtui." ruotsiksi.'
  }
}

module.exports = {
  messages,
  errors
}
