const { runServer, userDefaults } = require('saml-idp')
require('dotenv').config()

runServer({
  acsUrl: process.env.ASCURL,
  audience: process.env.AUDIENCE,
  config: {
    user: userDefaults,
    metadata: [
      {
        id: 'urn:oid:2.5.4.3',
        optional: false,
        displayName: 'cn',
        description: 'cn',
        multiValue: false
      },
      {
        id: 'urn:oid:2.16.840.1.113730.3.1.241',
        optional: false,
        displayName: 'displayName',
        description: 'displayName',
        multiValue: false
      },
      {
        id: 'urn:oid:1.3.6.1.4.1.5923.1.1.1.6',
        optional: false,
        displayName: 'eduPersonPrincipalName',
        description: 'eduPersonPrincipalName',
        multiValue: false
      },
      {
        id: 'urn:oid:0.9.2342.19200300.100.1.3',
        optional: false,
        displayName: 'mail',
        description: 'mail',
        multiValue: false
      },
      {
        id: 'urn:oid:2.5.4.10',
        optional: false,
        displayName: 'o',
        description: 'o',
        multiValue: false
      },
      {
        id: 'urn:oid:1.3.6.1.4.1.25178.1.2.14',
        optional: false,
        displayName: 'schacPersonalUniqueCode',
        description: 'schacPersonalUniqueCode',
        multiValue: false,
        
      }
    ],
    user: {
      "urn:oid:1.3.6.1.4.1.25178.1.2.14": 'teppotest',
      cn: 'Teppo Testikäyttäjä',
      displayName: 'Teppo',
      eduPersonPrincipalName: 'teppo@yliopisto.fi',
      mail: 'teppohaka@mailinator.com',
      o: 'University of Yliopisto',
      schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:fi:yliopisto.fi:x8734'
    }
  }
})
