# Digital Self Assesment-työkalun rekisteri- ja tietosuojaseloste

## Rekisterin nimi

Digital Self Assesment (DISA)-työkalu.

## Rekisterinpitäjä

Helsingin Yliopisto, Tietojenkäsittelytieteen osasto

PL 68 (Pietari Kalmin katu 5)
00014 HELSINGIN YLIOPISTO

## Rekisteriasioista vastaava henkilö

Matti Luukkainen, ​ mluukkai@cs.helsinki.fi

## Henkilötietojen käsittelyn tarkoitus

Rekisteriin tallennetaan vain tietoja, joilla on käyttötarkoitus.

* Henkilön nimeä tarvitaan, jotta käyttäjät voivat tunnistaa muita käyttäjiä. Esimerkiksi opettajan lisätessä apuopettajia, hän voi etsiä nimen perusteella.
* Henkilön opiskelijanumeroa ja laitosta käytetään yksilöimään henkilö, jolloin opiskelijanumerolle osoitetut tehtävämerkinnät voidaan liittää oikeaan opiskelijaan.
* Opiskelijan itse tallentamia tietoja (kurssirekisteröityminen, itsearviot) ja opettajien tallentamia tehtävämerkintöjä käytetään palautteen muodostamiseen opiskelijalle ja itsearviointien tietojen esittämiseen opettajalle.
* Lokitietoja kerätään vian selvittämiseksi ongelmatilanteissa.

## Rekisterin tietosisältö

Rekisteriin tallennetaan seuraavat tiedot henkilöistä.

* henkilön etu- ja sukunimi
* henkilön opiskelijanumero
* laitos (yliopisto), jossa henkilö toimii
* henkilön rooli DISA-työkalussa käsiteltävillä kursseilla (opettaja tai opiskelija)
* henkilölle merkityt tehtäväsuoritukset DISA-työkalussa käsiteltävillä kursseilla
* henkilön täyttämät itsearviointilomakkeet, jotka sisältävät numeerisia ja sanallisia itsearvioita henkilön osaamisesta kurssin aihepiireihin liittyen

Lisäksi rekisteriin tallennetaan lokitiedot, eli DISA-työkalun palvelimelle lähetetyt HTTP pyynnöt.

## Säännönmukaiset tietolähteet

Rekisteriin tallennetaan tietoja henkilöstä, kun

* henkilö luovuttaa tietoja kirjautumisen yhteydessä.
* henkilö toimii DISA-työkalussa jollakin kurssilla, eli rekisteröityy kurssille tai täyttää itsearviointilomakkeita.
* Jonkin DISA-työkalun kurssin opettaja tallentaa tehtäväsuorituksia DISA-työkalun kautta.
* henkilö lähettää pyynnön DISA-työkalun palvelimelle (lokitieto).

## Henkilötietojen tallentaminen, säilyttäminen, suojaaminen ja käsittely

Henkilötiedot on suojattu asiattomalta pääsyltä ja käsittelemiseltä. DISA-työkalun palvelin myöntää selaimelle valtuuden (token) kirjautumisen yhteydessä. Palvelin varmistaa käyttäjän henkilöllisyyden jokaisen pyynnön yhteydessä tämän valtuuden avulla.

Tiedot säilytetään Helsingin yliopiston hallussa olevalla palvelimella Suomessa. Henkilötietojen käsittelyssä on huomioitu EU:n tietosuoja-asetuksen vaatimukset.

Tietosisällöstä tallennetaan varmuuskopioita viikoittaisin väliajoin.

## Tietojen säännönmukaiset luovutukset

Kaikki rekisteriin henkilöistä tallennettava tieto on näkyvissä henkilölle itselleen ja käyttäjille, joilla on ylläpitäjän oikeudet. Ylläpitäjän oikeudet myönnetään vain henkilöille, jotka ovat vastuussa DISA-työkalun ylläpidosta.

Lisäksi tiedot henkilöstä ovat näkyvissä kaikille opettajille kursseilla, joihin henkilö on rekisteröitynyt DISA-työkalussa. Kurssiin liittyvät tiedot (roolit, itsearviot ja tehtävämerkinnät) ovat näkyvissä vain asiaankuuluvan kurssin opettajille.

## Rekisterin suojauksen periaatteet

Sovelluksen yhteydessä olevaa rekisteriä ylläpidetään teknisenä tallenteena salatun tietoliikenneyhteyden kautta salasanoin ja palomuurein suojattuina.

Rekisteriin sisältyvät henkilötiedot säilytetään luottamuksellisina. Rekisterin käyttö on ohjeistettu ja henkilörekisteriin pääsy on rajattu siten, että ylläpitäjän asemassa järjestelmään tallennettuihin tietoihin pääsevät käsiksi ja niitä ovat oikeutettuja käyttämään vain ne henkilöt, joilla on tehtäviensä puolesta siihen oikeus ja jotka tarvitsevat tietoja tehtävässään. Henkilötietoja käsittelevällä henkilöstöllä on vaitiolovelvollisuus.

Järjestelmään sisäänpääsy edellyttää rekisterin käyttäjältä käyttäjätunnuksen ja salasanan syöttämistä. Palvelinympäristö on suojattu salasanoilla ja asianmukaisella palomuurilla. Palvelimen ja käyttäjän koneen välinen tietoliikenne kulkee salattuna.

## Tarkastusoikeudet

Käyttäjänä sinulla on oikeus saada pääsy itseäsi koskeviin henkilötietoihin, mukaan lukien oikeus saada jäljennös sinua koskevista henkilötiedoista; pyytää itseäsi koskevien henkilötietojen oikaisemista tai poistamista ja tietyin edellytyksin pyytää käsittelyn rajoittamista tai vastustaa henkilötietojen käsittelyä. Tiedot luovutetaan asiakkaalle ymmärrettävässä muodossa ja aina kirjallisesti. Tietoja ja korjauksia voi pyytää lähettämällä pyynnön sähköpostitse osoitteeseen grp-toska@helsinki.fi.

## Oikeus vaatia tiedon korjaamista

Rekisterinpitäjä oikaisee, poistaa tai täydentää rekisterissä olevan, käsittelyn tarkoituksen kannalta virheellisen, tarpeettoman, puutteellisen tai vanhentuneen henkilötiedon oma-aloitteisesti tai rekisteröidyn vaatimuksesta. Rekisteröidyn tulee ottaa yhteyttä rekisterinpitäjään (grp-toska@helsinki.fi) tiedon korjaamiseksi.

## Muut henkilötietojen käsittelyyn liittyvät oikeudet

Rekisteröidyllä on myös oikeus kieltää rekisterinpitäjää käsittelemästä häntä itseään koskevia tietoja tässä rekisteriselosteessa mainittuihin tarkoituksiin, ellei tietojen käsittelyyn ole muuta lakiin, viranomaismääräykseen tai vastaavaan liittyvää perustetta. Markkinointikieltoja (soitto, painettu suoramarkkinointi, tekstiviesti ja sähköposti) koskevat. Tietojen korjauspyynnöt osoitetaan henkilökohtaisesti sähköpostitse (grp-toska@helsinki.fi).

Lisäksi rekisteröidyllä on oikeus tehdä valitus henkilötiedon käsittelystä asianmukaiselle valvontaviranomaiselle.

