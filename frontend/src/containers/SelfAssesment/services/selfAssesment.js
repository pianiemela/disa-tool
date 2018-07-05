const existingSelfAssesments = [
  {
    id: 1,
    fin_name: 'Loppuarvio Lineaarialgebra',
    fin_instructions: 'Täytä tämä arvio huolellisesti',
    structure: {
      fin_name: 'Lineaarialgebra ja Matriisilaskenta I',
      type: 'category',
      questionModules: [
        {
          id: 1,
          fin_name: 'Yhtälöryhmät',
          textFieldOn: true
        },
        {
          id: 2,
          fin_name: 'Vektoriavaruudet',
          textFieldOn: true
        },
        {
          id: 3,
          fin_name: 'Virittäminen ja vapaus',
          textFieldOn: true
        },
        {
          id: 4,
          fin_name: 'Matriisit',
          textFieldOn: true
        },
        {
          id: 5,
          fin_name: 'Geometria',
          textFieldOn: true
        },
        {
          id: 6,
          fin_name: 'Matlab-tyyppisen ohjelman käyttäminen (MO)',
          textFieldOn: true
        },
        {
          id: 7,
          fin_name: 'Matematiikan lukeminen ja kirjoittaminen (LK)',
          textFieldOn: true
        },
        {
          id: 8,
          fin_name: 'Matemaattinen keskustelu',
          textFieldOn: true
        },
        {
          id: 9,
          fin_name: 'Palautteen antaminen ja vastaanottaminen (PA)',
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
    fin_name: 'Väliarvio Lineaarialgebra',
    fin_instructions: 'Täytä tämä arvio huolellisesti',
    structure: {
      questionModules: [
        {
          id: 1,
          fin_name: 'Yhtälöryhmät',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 1,
              fin_name: 'Osaan muokata yhtälöryhmää vastaavan matriisin alkeisrivitoimituksilla redusoiduksi porrasmatriisiksi'
            },
            {
              id: 2,
              fin_name: 'Osaan päätellä yhtälöryhmän ratkaisut redusoidusta porrasmatriisista'
            },
            {
              id: 3,
              fin_name: 'Tunnen lineaarisen yhtälöryhmän ratkaisujen lukumäärään liittyvät rajoitukset'
            },
            {
              id: 4,
              fin_name: 'Osaan kirjoittaa lineaarisen yhtälöryhmän matriisiyhtälönä'
            },
            {
              id: 5,
              fin_name: 'Osaan käyttää yhtälöryhmiä käytännön ongelmien mallintamiseen'
            },
            {
              id: 6,
              fin_name: 'Tunnen yhtälönratkaisun periaatteet ja tiedän, että alkeisrivitoimitukset säilyttävät yhtälöryhmien yhtäpitävyyden'
            },
            {
              id: 7,
              fin_name: 'Tunnen yhtälöryhmän kerroinmatriisin kääntyvyyden yhteyden yhtälöryhmän ratkaisujen lukumäärään'
            }
          ]
        },
        {
          id: 2,
          fin_name: 'Vektoriavaruudet',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 8,
              fin_name: 'Tunnen vektorin määritelmän lukujonona ja osaan havainnollistaa tason vektoreita pisteinä tai suuntajanoina'
            },
            {
              id: 9,
              fin_name: 'Osaan laskea yhteen ja vähentää sekä kertoa skalaareilla avaruude R^n vektoreita'
            },
            {
              id: 10,
              fin_name: 'Tiedän, miltä yhden tai kahden vektorin virittämä aliavaruus näyttää'
            },
            {
              id: 11,
              fin_name: 'Osaan kirjoittaa vektoreiden virittämän aliavaruuden joukkomerkintää käyttäen ja luetella kyseisen joukon alkioita'
            },
            {
              id: 12,
              fin_name: 'Tiedän, miltä avaruuden R^3 aliavaruudet näyttävät'
            },
            {
              id: 13,
              fin_name: 'Tiedän, mitkä ovat suoran ja tason dimensiot'
            },
            {
              id: 14,
              fin_name: 'Osaan muodostaa vektorien virittämälle aliavaruudelle kannan'
            },
            {
              id: 15,
              fin_name: 'Osaan selvittää vektorien virittämän aliavaruuden dimension'
            }
          ]

        },
        {
          id: 3,
          fin_name: 'Virittäminen ja vapaus',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 16,
              fin_name: 'Osaan selvittää, onko vektori toisten vektorien lineaarikombinaatio'
            },
            {
              id: 17,
              fin_name: 'Osaan muodostaa yhtälön, jota tarvitaan sen tutkimisessa, virittävätkö annetut vektorit avaruuden'
            },
            {
              id: 18,
              fin_name: 'Osaan muodostaa yhtälön, jota tarvitaan vektorijonon vapauden tutkimisessa'
            },
            {
              id: 19,
              fin_name: 'Osaan soveltaa yhtälöryhmän ratkaisujen lukumäärään liittyvää päättelyä sen tutkimiseen, virittävätkö vektorit avaruuden'
            },
            {
              id: 20,
              fin_name: 'Osaan soveltaa yhtälöryhmän ratkaisujen lukumäärään liittyvää päättelyä vektorijonon vapauden tutkimiseen'
            },
            {
              id: 21,
              fin_name: 'Osaan selvittää, onko vektorijono kanta'
            },
            {
              id: 22,
              fin_name: 'Osaan laskea vektorin koordinaatit annetun kannan suhteen sekä selvittää vektorin sen koordinaattien perusteella'
            },
            {
              id: 23,
              fin_name: 'Tiedän, miten vektorijonon vapaus liittyy vektoreista muodostettavien lineaarikombinaatioiden kertoimien yksikäsitteisyyteen'
            },
            {
              id: 24,
              fin_name: 'Osaan analysoida vektorijonon vapautta tai viritysominaisuuksia myös silloin, kun vektoreiden komponentteja ei ole annettu'
            }
          ]
        },
        {
          id: 4,
          fin_name: 'Matriisit',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 29,
              fin_name: 'Tunnen matriisien kertolaskun eroavaisuudet reaalilukujen kertolaskuun verrattuna'
            },
            {
              id: 30,
              fin_name: 'Osaan tarkistaa käänteismatriisin määritelmän nojalla, ovatko kaksi annettua matriisia toistensa käänteismatriiseja'
            },
            {
              id: 31,
              fin_name: 'Osaan selvittää determinantin avulla, onko matriisi kääntyvä'
            },
            {
              id: 32,
              fin_name: 'Osaan hyödyntää determinantin laskusääntöjä'
            },
            {
              id: 33,
              fin_name: 'Osaan etsiä pienen matriisin ominaisarvot ja -vektorit'
            },
            {
              id: 34,
              fin_name: 'Tunnen ominaisvektorin geometrisen merkityksen ja osaan selvittää kuvasta, onko vektori matriisin ominaisvektori'
            },
            {
              id: 35,
              fin_name: 'Osaan selvittää redusoimalla, onko matriisi kääntyvä'
            },
            {
              id: 36,
              fin_name: 'Osaan soveltaa matriisikertolaskua ja matriisien ominaisuuksia käytännön ongelmien mallintamiseen'
            },
            {
              id: 37,
              fin_name: 'Osaan käyttää käänteismatriisia matriisiyhtälöiden ratkaisemisessa'
            },
            {
              id: 38,
              fin_name: 'Tiedän, miten käänteismatriisi liittyy alkeisrivitoimituksiin ja osaan löytää käänteismatriisin niiden avulla, jos sellainen on olemassa'
            },
            {
              id: 39,
              fin_name: 'Osaan tutkia, onko matriisi diagonalisoituva'
            }
          ]

        },
        {
          id: 5,
          fin_name: 'Geometria',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 40,
              fin_name: 'Osaan tutkia, ovatko kaksi vektoria yhdensuuntaiset'
            },
            {
              id: 41,
              fin_name: 'Tunnen suoran ja tason määritelmät vektorijoukkona ja osaan selvittää, onko annettu vektori suoran tai tason alkio'
            },
            {
              id: 42,
              fin_name: 'Osaan laskea avaruuden R^n vektorien pistetulon'
            },
            {
              id: 43,
              fin_name: 'Osaan laskea vektorin normin'
            },
            {
              id: 44,
              fin_name: 'Osaan tarkistaa pistetulon avulla, ovatko avaruuden R^n vektorit kohtisuorassa'
            },
            {
              id: 45,
              fin_name: 'Osaan selvittää suoran tai tason, kun on annettu riittävä määrä siihen kuuluvia vektoreita'
            },
            {
              id: 46,
              fin_name: 'Osaan laskea projektion kaavan avulla'
            },
            {
              id: 47,
              fin_name: 'Osaan määrittää tasovektorin projektion piirtämällä'
            },
            {
              id: 48,
              fin_name: 'Osaan hyödyntää pistetulon laskusääntöjä lausekkeiden sieventämiseen'
            }, {
              id: 49,
              fin_name: 'Tunnen pistetulon ja normin välisen yhteyden ja osaan laskea normin pistetulon avulla'
            },
            {
              id: 50,
              fin_name: 'Osaan selvittää suoran tai tason, kun sen yhtälö (eli normaalimuoto) on annettu'
            },
            {
              id: 51,
              fin_name: 'Osaan määrittää suoran tai tason normaalimuodon'
            }
          ]

        },
        {
          id: 6,
          fin_name: 'Matlab-tyyppisen ohjelman käyttäminen (MO)',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 52,
              fin_name: 'Osaan syöttää annetun koodin ohjelmaan'
            },
            {
              id: 53,
              fin_name: 'Osaan tehdä annettuun koodiin pieniä muutoksia halutun lopputuloksen aikaansaamiseksi'
            },
            {
              id: 54,
              fin_name: 'Tunnen lineaarialgebraan liittyvät ohjelman peruskomennot'
            },
            {
              id: 55,
              fin_name: 'Osaan etsiä tietolähteistä tarvitsemani komennot, jos en muista tai tunne niitä'
            }
          ]
        },
        {
          id: 7,
          fin_name: 'Matematiikan lukeminen ja kirjoittaminen (LK)',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 56,
              fin_name: 'Käytän vastauksissani kurssin merkintöjä'
            },
            {
              id: 57,
              fin_name: 'Tunnen eron määritelmän, lauseen ja esimerkin välillä'
            },
            {
              id: 58,
              fin_name: 'Ymmärrän, että matematiikkaa lukiessa ei voi heti ymmärtää kaikkea, vaan on usein palattava takaisin tai hypättävä vaikeiden kohtien yli'
            },
            {
              id: 59,
              fin_name: 'Kirjoitan vastauksiini kokonaisia ja ymmärrettäviä lauseita, joista ulkopuolinen lukijakin saa selvän'
            },
            {
              id: 60,
              fin_name: 'Määrittelen todistuksissa käyttämäni muuttujat'
            },
            {
              id: 61,
              fin_name: 'Osaan tarkistaa, että jokin konkreettinen objekti toteuttaa annetun määritelmän'
            },
            {
              id: 62,
              fin_name: 'Osaan käyttää selittävää lukutapaa määritelmien tai todistusten ymmärtämiseksi'
            },
            {
              id: 66,
              fin_name: 'Puhun matemaattisista aiheista toisille'
            },
            {
              id: 67,
              fin_name: 'Osaan ilmaista tarvitsevani apua matemaattisen ongelman ratkaisemiseen'
            }
          ]

        },
        {
          id: 8,
          fin_name: 'Matemaattinen keskustelu',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 66,
              fin_name: 'Puhun matemaattisista aiheista toisille'
            },
            {
              id: 67,
              fin_name: 'Osaan ilmaista tarvitsevani apua matemaattisen ongelman ratkaisemiseen'
            },
            {
              id: 68,
              fin_name: 'Käyn matemaattisia keskusteluja, joissa ilmaisen omia ajatuksiani ja kuuntelen toisen ideoita'
            },
            {
              id: 69,
              fin_name: 'Käytän keskustelussa oikeita nimityksiä matemaattisille käsitteille'
            },
            {
              id: 70,
              fin_name: 'Osaan selittää, mikä kohta matemaattisen ongelman ratkaisemisessa tuottaa minulle vaikeuksia'
            },
            {
              id: 71,
              fin_name: 'Kykenen ylläpitämään matemaattista keskustelua, joka hyödyttää molempia osapuolia'
            },
            {
              id: 72,
              fin_name: 'Muotoilen täsmällisiä kysymyksiä saadakseni apua matemaattisiin ongelmiin'
            }
          ]
        },
        {
          id: 9,
          fin_name: 'Palautteen antaminen ja vastaanottaminen (PA)',
          answers: ['Heikosti', 'Kohtalaisesti', 'Hyvin'],
          objectives: [
            {
              id: 73,
              fin_name: 'Luen tehtävistäni annetun palautteen ja korjaan tehtäviä palautteen perusteella'
            },
            {
              id: 74,
              fin_name: 'Annan vertaispalautetta toisten opiskelijoiden töistä'
            },
            {
              id: 75,
              fin_name: 'En ota saamaani palautetta henkilökohtaisesti, vaan ymmärrän, että palaute on annettu, jotta oppisin lisää'
            },
            {
              id: 76,
              fin_name: 'Otan saamani palautteen puheeksi ohjaajien kanssa, jos en ole varma, mitä palautteen antaja on tarkoittanut'
            },
            {
              id: 77,
              fin_name: 'Annan rakentavaa vertaispalautetta, joka tähtää toisen opiskelijan työn parantamiseen'
            },
            {
              id: 78,
              fin_name: 'Osaan toimia tilanteessa, jossa saan eri lähteistä ristiriitaista palautetta'
            },
            {
              id: 79,
              fin_name: 'Antaessani palautetta asetun palautteen saajan asemaan, jotta voin arvioida, millainen palaute olisi kussakin tilanteessa mahdollisimman hyödyllistä'
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
