const { runServer, userDefaults } = require('saml-idp')
require('dotenv').config()

runServer({
  acsUrl: process.env.ASCURL,
  audience: process.env.AUDIENCE,
  config: {
    user: userDefaults,
    metadata: [
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
        id: 'urn:oid:1.3.6.1.4.1.25178.1.2.9',
        optional: false,
        displayName: 'schacHomeOrganization',
        description: 'schacHomeOrganization',
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
      displayName: 'Teppo Testikäyttäjä',
      eduPersonPrincipalName: 'teppo@yliopisto.fi',
      schacHomeOrganization: 'yliopisto.fi',
      schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:fi:yliopisto.fi:x8734'
    }
  }
})
