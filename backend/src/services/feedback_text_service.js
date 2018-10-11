
const texts = {
  noFeedback: ['There is no feedback for this category.', 'Tästä kategoriasta ei ole palautetta.'],
  categoryGood: ['Very nice', 'Arvioimasi arvosana on hyvin linjassa tekemiesi tehtävien kanssa. Hienoa!'],
  categoryLow: ['Too low', 'Arvioimasi arvosana on matalampi kuin mitä tekemäsi tehtävät antaisivat olettaa.'],
  categoryHigh: ['Too high', 'Arvioimasi arvosana on korkeampi kuin mitä tekemäsi tehtävät antaisivat olettaa.'],
  extraDone: amount => [
    `You have done ${amount} extra`,
    `Olet kuitenkin tehnyt tehtäviä korkeammilta taitotasoilta ${amount} joten on mahdollista, että arvosanasi tulisi olla korkeampi kuin mitä tämä laskenta osoittaa.`],
  lotDone: ['a lot', 'paljon'],
  someDone: ['some', 'jonkin verran'],
  categoryCheckBelow: [
    'Check below for more detailed stats',
    'Voit alta tarkastella suoritusmääriäsi kunkin tavoitetason kohdalla.'],
  generalLotDone: ['very nicely', 'oikein hyvin'],
  generalSomeDone: ['pretty nicely', 'ihan kivasti'],
  generalLittleDone: ['quite little', 'aika heikosti'],
  generalAmount: amount => [
    `You have done ${amount} work during the course.`,
    `Olet tehnyt ${amount} töitä kurssilla tehtävien parissa.`],
  generalMost: category => [
    `The most you have worked on tasks from category ${category}.`,
    `Suhteessa eniten tehtäviä olet tehnyt osiosta ${category}.`],
  generalLeast: category => [
    `You should probably focus more on tasks from category ${category}.`,
    `Enemmän sinun kannattaisi ehkä panostaa osion ${category} tehtäviin.`],
  generalGood: ['Your self assessments seem very accurate', 'Arviosi ovat erittäin osuvia.'],
  generalLow: [
    'Your assessments seem in general to be a bit too harsh.',
    'Arvioit itseäsi yleisesti turhan ankarasti.'],
  generalHigh: [
    'Your assessments seem in general to be a bit too optimistic.',
    'Olit arvioissasi yleisesti liian höveli.'],
  generalInconsistent: [
    'Your assessments were somewhat inconsistent in relation to your performance.',
    'Arviosi heittelehtivät jonkin verran.']
}

const mapLang = lang => (lang === 'eng' ? 0 : 1)

const generateText = list => (
  list.reduce((acc, cur) => `${acc} ${cur}`, '')
)

const generateCategoryText = (feedback, difference = 0, extraDone = 0, lang = 'fin') => {
  const langIndex = mapLang(lang)
  const textList = []
  if (!feedback) {
    return texts.noFeedback[langIndex]
  }
  if (difference > 0) {
    textList.push(texts.categoryHigh[langIndex])
  } else if (difference < 0) {
    textList.push(texts.categoryLow[langIndex])
  } else {
    textList.push(texts.categoryGood[langIndex])
  }
  if (extraDone === 1) {
    textList.push(texts.extraDone(texts.someDone[langIndex])[langIndex])
  } else if (extraDone === 2) {
    textList.push(texts.extraDone(texts.lotDone[langIndex])[langIndex])
  }
  textList.push(texts.categoryCheckBelow[langIndex])
  return generateText(textList)
}

const generateGeneralText = (feedback, amount, best, worst, accuracy, lang = 'fin') => {
  const langIndex = mapLang(lang)
  if (!feedback) {
    return ''
  }
  const textList = []
  textList.push(texts.generalAmount(texts[amount][langIndex])[langIndex])
  if (best) textList.push(texts.generalMost(best)[langIndex])
  if (worst) textList.push(texts.generalLeast(worst)[langIndex])
  textList.push(texts[accuracy][langIndex])
  return generateText(textList)
}

module.exports = {
  generateCategoryText,
  generateGeneralText
}
