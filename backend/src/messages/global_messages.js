const privilege = {
  failure: {
    eng: '"Pääsy estetty." englanniksi.',
    fin: 'Pääsy estetty.',
    swe: '"Pääsy estetty." ruotsiksi.'
  }
}

const notfound = {
  failure: {
    eng: '"Haettua tietuetta ei löytynyt." englanniksi.',
    fin: 'Haettua tietuetta ei löytynyt.',
    swe: '"Haettua tietuetta ei löytynyt." ruotsiksi.'
  }
}

const unexpected = {
  failure: {
    eng: '"Yllättävä virhe tapahtui." englanniksi.',
    fin: 'Yllättävä virhe tapahtui.',
    swe: '"Yllättävä virhe tapahtui." ruotsiksi.'
  }
}

module.exports = {
  privilege,
  notfound,
  unexpected
}
