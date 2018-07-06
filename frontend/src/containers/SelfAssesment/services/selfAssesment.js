const existingSelfAssesments = [
  {
    id: 1,
    name: 'Loppuarvio Lineaarialgebra',
    fin_instructions: 'Täytä tämä arvio huolellisesti',
    structure: {
      name: 'Lineaarialgebra ja Matriisilaskenta I',
      type: 'category',
      questionModules: [
        {
          id: 1,
          name: 'Yhtälöryhmät',
          textFieldOn: true
        },
        {
          id: 2,
          name: 'Vektoriavaruudet',
          textFieldOn: true
        },
        {
          id: 3,
          name: 'Virittäminen ja vapaus',
          textFieldOn: true
        },
        {
          id: 4,
          name: 'Matriisit',
          textFieldOn: true
        },
        {
          id: 5,
          name: 'Geometria',
          textFieldOn: true
        },
        {
          id: 6,
          name: 'Matlab-tyyppisen ohjelman käyttäminen (MO)',
          textFieldOn: true
        },
        {
          id: 7,
          name: 'Matematiikan lukeminen ja kirjoittaminen (LK)',
          textFieldOn: true
        },
        {
          id: 8,
          name: 'Matemaattinen keskustelu',
          textFieldOn: true
        },
        {
          id: 9,
          name: 'Palautteen antaminen ja vastaanottaminen (PA)',
          textFieldOn: true
        }
      ]
    },
    open: false,
    active: false,
    immediate_feedback: 'none',
    course_instance_id: 1
  },
  {
    id: 2,
    name: 'Väliarvio Lineaarialgebra',
    fin_instructions: 'Täytä tämä arvio huolellisesti',
    structure: {
      questionModules: [
        {
          id: 1,
          name: 'Yhtälöryhmät',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 1,
              name: 'Osaan muokata yhtälöryhmää vastaavan matriisin alkeisrivitoimituksilla redusoiduksi porrasmatriisiksi'
            },
            {
              id: 2,
              name: 'Osaan päätellä yhtälöryhmän ratkaisut redusoidusta porrasmatriisista'
            },
            {
              id: 3,
              name: 'Tunnen lineaarisen yhtälöryhmän ratkaisujen lukumäärään liittyvät rajoitukset'
            },
            {
              id: 4,
              name: 'Osaan kirjoittaa lineaarisen yhtälöryhmän matriisiyhtälönä'
            },
            {
              id: 5,
              name: 'Osaan käyttää yhtälöryhmiä käytännön ongelmien mallintamiseen'
            },
            {
              id: 6,
              name: 'Tunnen yhtälönratkaisun periaatteet ja tiedän, että alkeisrivitoimitukset säilyttävät yhtälöryhmien yhtäpitävyyden'
            },
            {
              id: 7,
              name: 'Tunnen yhtälöryhmän kerroinmatriisin kääntyvyyden yhteyden yhtälöryhmän ratkaisujen lukumäärään'
            }
          ]
        },
        {
          id: 2,
          name: 'Vektoriavaruudet',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 8,
              name: 'Tunnen vektorin määritelmän lukujonona ja osaan havainnollistaa tason vektoreita pisteinä tai suuntajanoina'
            },
            {
              id: 9,
              name: 'Osaan laskea yhteen ja vähentää sekä kertoa skalaareilla avaruude R^n vektoreita'
            },
            {
              id: 10,
              name: 'Tiedän, miltä yhden tai kahden vektorin virittämä aliavaruus näyttää'
            },
            {
              id: 11,
              name: 'Osaan kirjoittaa vektoreiden virittämän aliavaruuden joukkomerkintää käyttäen ja luetella kyseisen joukon alkioita'
            },
            {
              id: 12,
              name: 'Tiedän, miltä avaruuden R^3 aliavaruudet näyttävät'
            },
            {
              id: 13,
              name: 'Tiedän, mitkä ovat suoran ja tason dimensiot'
            },
            {
              id: 14,
              name: 'Osaan muodostaa vektorien virittämälle aliavaruudelle kannan'
            },
            {
              id: 15,
              name: 'Osaan selvittää vektorien virittämän aliavaruuden dimension'
            }
          ]

        },
        {
          id: 3,
          name: 'Virittäminen ja vapaus',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 16,
              name: 'Osaan selvittää, onko vektori toisten vektorien lineaarikombinaatio'
            },
            {
              id: 17,
              name: 'Osaan muodostaa yhtälön, jota tarvitaan sen tutkimisessa, virittävätkö annetut vektorit avaruuden'
            },
            {
              id: 18,
              name: 'Osaan muodostaa yhtälön, jota tarvitaan vektorijonon vapauden tutkimisessa'
            },
            {
              id: 19,
              name: 'Osaan soveltaa yhtälöryhmän ratkaisujen lukumäärään liittyvää päättelyä sen tutkimiseen, virittävätkö vektorit avaruuden'
            },
            {
              id: 20,
              name: 'Osaan soveltaa yhtälöryhmän ratkaisujen lukumäärään liittyvää päättelyä vektorijonon vapauden tutkimiseen'
            },
            {
              id: 21,
              name: 'Osaan selvittää, onko vektorijono kanta'
            },
            {
              id: 22,
              name: 'Osaan laskea vektorin koordinaatit annetun kannan suhteen sekä selvittää vektorin sen koordinaattien perusteella'
            },
            {
              id: 23,
              name: 'Tiedän, miten vektorijonon vapaus liittyy vektoreista muodostettavien lineaarikombinaatioiden kertoimien yksikäsitteisyyteen'
            },
            {
              id: 24,
              name: 'Osaan analysoida vektorijonon vapautta tai viritysominaisuuksia myös silloin, kun vektoreiden komponentteja ei ole annettu'
            }
          ]
        },
        {
          id: 4,
          name: 'Matriisit',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 29,
              name: 'Tunnen matriisien kertolaskun eroavaisuudet reaalilukujen kertolaskuun verrattuna'
            },
            {
              id: 30,
              name: 'Osaan tarkistaa käänteismatriisin määritelmän nojalla, ovatko kaksi annettua matriisia toistensa käänteismatriiseja'
            },
            {
              id: 31,
              name: 'Osaan selvittää determinantin avulla, onko matriisi kääntyvä'
            },
            {
              id: 32,
              name: 'Osaan hyödyntää determinantin laskusääntöjä'
            },
            {
              id: 33,
              name: 'Osaan etsiä pienen matriisin ominaisarvot ja -vektorit'
            },
            {
              id: 34,
              name: 'Tunnen ominaisvektorin geometrisen merkityksen ja osaan selvittää kuvasta, onko vektori matriisin ominaisvektori'
            },
            {
              id: 35,
              name: 'Osaan selvittää redusoimalla, onko matriisi kääntyvä'
            },
            {
              id: 36,
              name: 'Osaan soveltaa matriisikertolaskua ja matriisien ominaisuuksia käytännön ongelmien mallintamiseen'
            },
            {
              id: 37,
              name: 'Osaan käyttää käänteismatriisia matriisiyhtälöiden ratkaisemisessa'
            },
            {
              id: 38,
              name: 'Tiedän, miten käänteismatriisi liittyy alkeisrivitoimituksiin ja osaan löytää käänteismatriisin niiden avulla, jos sellainen on olemassa'
            },
            {
              id: 39,
              name: 'Osaan tutkia, onko matriisi diagonalisoituva'
            }
          ]

        },
        {
          id: 5,
          name: 'Geometria',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 40,
              name: 'Osaan tutkia, ovatko kaksi vektoria yhdensuuntaiset'
            },
            {
              id: 41,
              name: 'Tunnen suoran ja tason määritelmät vektorijoukkona ja osaan selvittää, onko annettu vektori suoran tai tason alkio'
            },
            {
              id: 42,
              name: 'Osaan laskea avaruuden R^n vektorien pistetulon'
            },
            {
              id: 43,
              name: 'Osaan laskea vektorin normin'
            },
            {
              id: 44,
              name: 'Osaan tarkistaa pistetulon avulla, ovatko avaruuden R^n vektorit kohtisuorassa'
            },
            {
              id: 45,
              name: 'Osaan selvittää suoran tai tason, kun on annettu riittävä määrä siihen kuuluvia vektoreita'
            },
            {
              id: 46,
              name: 'Osaan laskea projektion kaavan avulla'
            },
            {
              id: 47,
              name: 'Osaan määrittää tasovektorin projektion piirtämällä'
            },
            {
              id: 48,
              name: 'Osaan hyödyntää pistetulon laskusääntöjä lausekkeiden sieventämiseen'
            }, {
              id: 49,
              name: 'Tunnen pistetulon ja normin välisen yhteyden ja osaan laskea normin pistetulon avulla'
            },
            {
              id: 50,
              name: 'Osaan selvittää suoran tai tason, kun sen yhtälö (eli normaalimuoto) on annettu'
            },
            {
              id: 51,
              name: 'Osaan määrittää suoran tai tason normaalimuodon'
            }
          ]

        },
        {
          id: 6,
          name: 'Matlab-tyyppisen ohjelman käyttäminen (MO)',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 52,
              name: 'Osaan syöttää annetun koodin ohjelmaan'
            },
            {
              id: 53,
              name: 'Osaan tehdä annettuun koodiin pieniä muutoksia halutun lopputuloksen aikaansaamiseksi'
            },
            {
              id: 54,
              name: 'Tunnen lineaarialgebraan liittyvät ohjelman peruskomennot'
            },
            {
              id: 55,
              name: 'Osaan etsiä tietolähteistä tarvitsemani komennot, jos en muista tai tunne niitä'
            }
          ]
        },
        {
          id: 7,
          name: 'Matematiikan lukeminen ja kirjoittaminen (LK)',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 56,
              name: 'Käytän vastauksissani kurssin merkintöjä'
            },
            {
              id: 57,
              name: 'Tunnen eron määritelmän, lauseen ja esimerkin välillä'
            },
            {
              id: 58,
              name: 'Ymmärrän, että matematiikkaa lukiessa ei voi heti ymmärtää kaikkea, vaan on usein palattava takaisin tai hypättävä vaikeiden kohtien yli'
            },
            {
              id: 59,
              name: 'Kirjoitan vastauksiini kokonaisia ja ymmärrettäviä lauseita, joista ulkopuolinen lukijakin saa selvän'
            },
            {
              id: 60,
              name: 'Määrittelen todistuksissa käyttämäni muuttujat'
            },
            {
              id: 61,
              name: 'Osaan tarkistaa, että jokin konkreettinen objekti toteuttaa annetun määritelmän'
            },
            {
              id: 62,
              name: 'Osaan käyttää selittävää lukutapaa määritelmien tai todistusten ymmärtämiseksi'
            },
            {
              id: 66,
              name: 'Puhun matemaattisista aiheista toisille'
            },
            {
              id: 67,
              name: 'Osaan ilmaista tarvitsevani apua matemaattisen ongelman ratkaisemiseen'
            }
          ]

        },
        {
          id: 8,
          name: 'Matemaattinen keskustelu',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 66,
              name: 'Puhun matemaattisista aiheista toisille'
            },
            {
              id: 67,
              name: 'Osaan ilmaista tarvitsevani apua matemaattisen ongelman ratkaisemiseen'
            },
            {
              id: 68,
              name: 'Käyn matemaattisia keskusteluja, joissa ilmaisen omia ajatuksiani ja kuuntelen toisen ideoita'
            },
            {
              id: 69,
              name: 'Käytän keskustelussa oikeita nimityksiä matemaattisille käsitteille'
            },
            {
              id: 70,
              name: 'Osaan selittää, mikä kohta matemaattisen ongelman ratkaisemisessa tuottaa minulle vaikeuksia'
            },
            {
              id: 71,
              name: 'Kykenen ylläpitämään matemaattista keskustelua, joka hyödyttää molempia osapuolia'
            },
            {
              id: 72,
              name: 'Muotoilen täsmällisiä kysymyksiä saadakseni apua matemaattisiin ongelmiin'
            }
          ]
        },
        {
          id: 9,
          name: 'Palautteen antaminen ja vastaanottaminen (PA)',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 73,
              name: 'Luen tehtävistäni annetun palautteen ja korjaan tehtäviä palautteen perusteella'
            },
            {
              id: 74,
              name: 'Annan vertaispalautetta toisten opiskelijoiden töistä'
            },
            {
              id: 75,
              name: 'En ota saamaani palautetta henkilökohtaisesti, vaan ymmärrän, että palaute on annettu, jotta oppisin lisää'
            },
            {
              id: 76,
              name: 'Otan saamani palautteen puheeksi ohjaajien kanssa, jos en ole varma, mitä palautteen antaja on tarkoittanut'
            },
            {
              id: 77,
              name: 'Annan rakentavaa vertaispalautetta, joka tähtää toisen opiskelijan työn parantamiseen'
            },
            {
              id: 78,
              name: 'Osaan toimia tilanteessa, jossa saan eri lähteistä ristiriitaista palautetta'
            },
            {
              id: 79,
              name: 'Antaessani palautetta asetun palautteen saajan asemaan, jotta voin arvioida, millainen palaute olisi kussakin tilanteessa mahdollisimman hyödyllistä'
            }
          ]
        }
      ]

    }

  }
]

export const getAllSelfAssesments = () => {
  const apiresponse = {
    message: 'success',
    data: {
      existingSelfAssesments
    }
  }

  const action = {
    type: 'GET_ALL_SELF_ASSESMENTS',
    apiresponse
  }

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, action)
  })
}