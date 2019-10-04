const router = require('express').Router()

router.delete('/shibboleth', (req, res) => {
  try {
    const logoutUrl = req.headers.shib_logout_url
    const { returnUrl } = req.body
    if (logoutUrl) {
      return res.status(200).send({ logoutUrl: `${logoutUrl}?return=${returnUrl}` }).end()
    }
    res.status(200).send({ logoutUrl: returnUrl }).end()
  } catch (err) {
    res.status(500).json({ error: `Error with logout: ${err}` })
  }
})

module.exports = router
