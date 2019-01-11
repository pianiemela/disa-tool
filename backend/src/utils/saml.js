const saml2 = require('saml2-js')
const fs = require('fs')
const config = require('../../conf-backend')

const spOptions = {
  entity_id: config.ENTITY_ID,
  private_key: fs.readFileSync('./samldata/key.pem').toString(),
  certificate: fs.readFileSync('./samldata/cert.pem').toString(),
  assert_endpoint: config.ASSERT_ENDPOINT,
  force_authn: true,
  auth_context: { comparison: 'exact', class_refs: ['urn:oasis:names:tc:SAML:1.0:am:password'] },
  nameid_format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  sign_get_request: false,
  allow_unencrypted_assertion: true
}

const idpOptions = {
  sso_login_url: config.SSO_LOGIN_URL,
  sso_logout_url: config.SSO_LOGOUT_URL,
  certificates: [fs.readFileSync('./samldata/idp-public-cert.pem').toString()]
}

const idp = new saml2.IdentityProvider(idpOptions)

// Call service provider constructor with options
const sp = new saml2.ServiceProvider(spOptions)

module.exports = {
  idp,
  sp
}
