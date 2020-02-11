import config from '../../../public/config'
import CryptoService from '../../services/CryptoService'

var randomstring = require('randomstring')

export default {
  name: 'login',
  data () {
    return {
      privateKey: null,
      publicKey: null,
      privateKey2: null,
      publicKey2: null,
      message: null,
      encrypted: null,
      decrypted: null,
      nonce: null
    }
  },
  mounted () {
    if (this.$route.query.doublename) {
      setTimeout(() => {
        this.autoLogin()
      }, 300)
    }
  },
  methods: {
    async loginToDesktop () {
      window.location.href = `https://dev.jimber.org/desktop`
    },
    async login () {
      var state = randomstring.generate()
      window.localStorage.setItem('state', state)
      var keys = await CryptoService.generateKeys(config.seedPhrase)
      var appid = config.appId

      window.location.href = `${config.botFrontEnd}?state=${state}&appid=${appid}&publickey=${encodeURIComponent(CryptoService.getEdPkInCurve(keys.publicKey))}&redirecturl=${encodeURIComponent(config.redirect_url)}`
    },
    async loginWithCustomScope (scope) {
      var state = randomstring.generate()
      var keys = await CryptoService.generateKeys(config.seedPhrase)
      var appid = config.appId
      var scope = JSON.stringify(scope) // { doubleName : true, email : false}

      window.localStorage.setItem('state', state)
      this.redirect(state, scope, appid, keys.publicKey, config.redirect_url)
    },
    async autoLogin () {
      console.log('AUTOLOGIN!')
      var state = randomstring.generate()
      var keys = await CryptoService.generateKeys(config.seedPhrase)
      var appid = config.appId
      var scope = JSON.stringify({ doubleName: true, email: false, derivedSeed: false })
      window.localStorage.setItem('state', state)
      console.log(config.redirect_url)
      window.location.href = `${config.botFrontEnd}?state=${state}&appid=${appid}&scope=${scope}&publickey=${encodeURIComponent(CryptoService.getEdPkInCurve(keys.publicKey))}&doublename=${this.$route.query.doublename}&logintoken=${this.$route.query.logintoken}&redirecturl=${encodeURIComponent(`${config.redirect_url}`)}`
    },
    async redirect (state, scope, appid, publicKey, redirectUrl) {
      window.location.href = `${config.botFrontEnd}?state=${state}&scope=${scope}&appid=${appid}&publickey=${encodeURIComponent(CryptoService.getEdPkInCurve(publicKey))}&redirecturl=${encodeURIComponent(redirectUrl)}`
    }
  }
}
