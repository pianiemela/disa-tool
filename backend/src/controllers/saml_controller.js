const router = require('express').Router()
const { DOMParser, XMLSerializer } = require('xmldom')
const samlify = require('samlify')
const {
  responseUrl,
  getMetadata,
  signToken
} = require('../services/saml_service')
const config = require('../../conf-backend')

const sp = samlify.ServiceProvider({
  metadata: config.samldata.metadata,
  encPrivateKey: config.samldata.key,
  privateKey: config.samldata.key,
  loginNameIDFormat: 'transient',
  authnRequestsSigned: true
})

let idp = null

router.get('/', async (req, res) => {
  const { entityID } = req.query
  const metadata = await getMetadata(config.IDP_ENTITY_ID)
  const parsedMetaData = new DOMParser().parseFromString(metadata, 'text/xml')
  const redirectMetadata = Array.prototype.find.call(
    parsedMetaData.getElementsByTagName('EntityDescriptor'),
    entity => Array.prototype.find.call(
      entity.attributes,
      attr => attr.name === 'entityID'
    ).value === entityID
  )
  redirectMetadata.getElementsByTagName('IDPSSODescriptor')[0]
    .setAttribute('WantAuthnRequestsSigned', 'true')
  idp = samlify.IdentityProvider({
    metadata: new XMLSerializer().serializeToString(redirectMetadata),
    isAssertionEncrypted: true,
    wantMessageSigned: true,
    messageSigningOrder: 'encrypt-then-sign',
    signatureConfig: {
      prefix: 'ds',
      location: {
        reference: '/samlp:Response/saml:Issuer',
        action: 'after'
      }
    }
  })
  const { context } = sp.createLoginRequest(idp, 'redirect')
  return res.redirect(context)
})

router.post('/assert', async (req, res) => {
  try {
    const response = await sp.parseLoginResponse(idp, 'post', req)
    const token = await signToken(response)
    if (!token) {
      res.redirect(config.FRONTEND_LOGIN)
      return
    }
    res.redirect(responseUrl(token))

  } catch (error) {
    console.log(error)
  }
})

router.get('/metadata', (req, res) => {
  res.header('Content-Type', 'text/xml').send(sp.getMetadata())
})

module.exports = router
