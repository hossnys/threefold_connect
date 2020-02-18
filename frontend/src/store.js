import Vue from 'vue'
import Vuex from 'vuex'
import socketService from './services/socketService'
import cryptoService from './services/cryptoService'
import userService from './services/userService'
import axios from 'axios'
import config from '../public/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    _state: null,
    redirectUrl: null,
    keys: {},
    doubleName: null,
    nameCheckStatus: {
      checked: false,
      checking: false,
      available: false
    },
    emailVerificationStatus: {
      checked: false,
      checking: false,
      valid: false
    },
    scannedFlagUp: false,
    cancelLoginUp: false,
    signedAttempt: null,
    firstTime: null,
    isMobile: false,
    scope: null,
    appId: null,
    appPublicKey: null,
    randomImageId: null,
    randomRoom: null,
    loginTimestamp: 0,
    loginTimeleft: 120,
    loginTimeout: 120,
    loginInterval: null
  },
  mutations: {
    setNameCheckStatus (state, status) {
      state.nameCheckStatus = status
    },
    setKeys (state, keys) {
      state.keys = keys
    },
    setDoubleName (state, name) {
      console.log(`Setting doubleName to ${name}`)
      state.doubleName = name
    },
    setState (state, _state) {
      state._state = _state
    },
    setRedirectUrl (state, redirectUrl) {
      state.redirectUrl = redirectUrl
    },
    setScannedFlagUp (state, scannedFlagUp) {
      state.scannedFlagUp = scannedFlagUp
    },
    setCancelLoginUp (state, cancelLoginUp) {
      state.cancelLoginUp = cancelLoginUp
    },
    setSignedAttempt (state, signedAttempt) {
      state.signedAttempt = signedAttempt
    },
    setFirstTime (state, firstTime) {
      state.firstTime = firstTime
    },
    setEmailVerificationStatus (state, status) {
      state.emailVerificationStatus = status
    },
    setScope (state, scope) {
      let parsedScope = JSON.parse(scope)
      state.scope = JSON.stringify(parsedScope)
    },
    setAppId (state, appId) {
      state.appId = appId
    },
    setAppPublicKey (state, appPublicKey) {
      state.appPublicKey = appPublicKey
    },
    setRandomImageId (state) {
      state.randomImageId = Math.floor(Math.random() * 266)
    },
    setIsMobile (state, isMobile) {
      state.isMobile = isMobile
    },
    setrandomRoom (state, randomRoom) {
      state.randomRoom = randomRoom
    },
    resetTimer (state) {
      if (state.loginInterval !== undefined) {
        clearInterval(state.loginInterval)
      }

      state.loginTimestamp = Date.now()

      state.loginInterval = setInterval(() => {
        state.loginTimeleft = Math.round(state.loginTimeout - ((Date.now() - state.loginTimestamp) / 1000))
        if (state.loginTimeleft <= 0) {
          clearInterval(this.loginInterval)
        }
      }, 1000)
    }
  },
  actions: {
    resetTimer (context) {
      context.commit('resetTimer')
    },
    setDoubleName (context, doubleName) {
      if (doubleName.indexOf('.3bot') < 0) {
        doubleName = `${doubleName}.3bot`
      }
      context.commit('setDoubleName', doubleName)
      socketService.emit('join', { room: doubleName })
    },
    setrandomRoom (context, randomRoom) {
      context.commit('setrandomRoom', randomRoom)
      socketService.emit('join', { room: randomRoom })
    },
    setAttemptCanceled (context, payload) {
      context.commit('setCancelLoginUp', payload)
    },
    SOCKET_connect (context, payload) {
      console.log(`hi, connected with SOCKET_connect`)
    },
    saveState (context, payload) {
      context.commit('setState', payload._state)
      context.commit('setRedirectUrl', payload.redirectUrl)
    },
    clearCheckStatus (context) {
      context.commit('setNameCheckStatus', {
        checked: false,
        checking: false,
        available: false
      })
    },
    checkName (context, doubleName) {
      doubleName = `${doubleName}.3bot`
      socketService.emit('checkname', { doubleName })
      context.commit('setNameCheckStatus', {
        checked: false,
        checking: false,
        available: false
      })
    },
    SOCKET_nameknown (context) {
      context.commit('setNameCheckStatus', {
        checked: true,
        checking: false,
        available: false
      })
    },
    SOCKET_namenotknown (context) {
      context.commit('setNameCheckStatus', {
        checked: true,
        checking: false,
        available: true
      })
    },
    async generateKeys (context) {
      context.commit('setKeys', await cryptoService.generateKeys())
    },
    SOCKET_cancelLogin (context) {
      console.log('f')
      context.commit('setCancelLoginUp', true)
    },
    async SOCKET_signedAttempt (context, data) {
      console.log('signedAttempt', data.signedAttempt)
      console.log('signedAttempt', data.doubleName)
      console.log('context.getters.firstTime', context.getters.firstTime)
      console.log('context.getters.isMobile', context.getters.isMobile)
      console.log('context.getters.randomImageId', context.getters.randomImageId)

      let publicKey = (await userService.getUserData(data.doubleName)).data.publicKey

      var utf8ArrayToStr = (function () {
        var charCache = new Array(128)
        var charFromCodePt = String.fromCodePoint || String.fromCharCode
        var result = []

        return function (array) {
          var codePt, byte1
          var buffLen = array.length

          result.length = 0

          for (var i = 0; i < buffLen;) {
            byte1 = array[i++]

            if (byte1 <= 0x7F) {
              codePt = byte1
            } else if (byte1 <= 0xDF) {
              codePt = ((byte1 & 0x1F) << 6) | (array[i++] & 0x3F)
            } else if (byte1 <= 0xEF) {
              codePt = ((byte1 & 0x0F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F)
            } else if (String.fromCodePoint) {
              codePt = ((byte1 & 0x07) << 18) | ((array[i++] & 0x3F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F)
            } else {
              codePt = 63
              i += 3
            }

            result.push(charCache[codePt] || (charCache[codePt] = charFromCodePt(codePt)))
          }

          return result.join('')
        }
      })()

      var signedAttempt = JSON.parse(utf8ArrayToStr(await cryptoService.validateSignedAttempt(data.signedAttempt, publicKey)))

      if (!signedAttempt) {
        console.log('Something went wrong ... ')
        return
      }

      if (signedAttempt.selectedImageId && !context.getters.firstTime && !context.getters.isMobile && signedAttempt.selectedImageId !== context.getters.randomImageId) {
        console.log('Resending notification!')
        context.dispatch('resendNotification')
      } else {
        console.log('Setting signedAttempt!')
        context.commit('setSignedAttempt', data)
      }
    },
    async loginUser (context, data) {
      console.log(`LoginUser`)
      context.dispatch('setDoubleName', data.doubleName)
      context.commit('setSignedAttempt', null)
      context.commit('setFirstTime', data.firstTime)
      context.commit('setRandomImageId')
      context.commit('setIsMobile', data.mobile)

      let publicKey = (await userService.getUserData(context.getters.doubleName)).data.publicKey
      console.log('Public key: ', publicKey)

      let randomRoom = generateUUID()

      let locationId = window.localStorage.getItem('locationId')

      if (locationId === null) {
        locationId = generateUUID()
        window.localStorage.setItem('locationId', locationId)
      }

      console.log('locationId UUID: ', locationId)

      let encryptedLoginAttempt = await cryptoService.encrypt(JSON.stringify({
        doubleName: context.getters.doubleName,
        state: context.getters._state,
        firstTime: data.firstTime,
        scope: context.getters.scope,
        appId: context.getters.appId,
        randomRoom: randomRoom,
        appPublicKey: context.getters.appPublicKey,
        randomImageId: !data.firstTime ? context.getters.randomImageId.toString() : null,
        locationId: locationId
      }), publicKey)

      console.log('State: ', context.getters._state)
      console.log('Encrypted login attempt: ', encryptedLoginAttempt)

      socketService.emit('leave', { 'room': context.getters.doubleName })
      context.dispatch('setrandomRoom', randomRoom)

      socketService.emit('login', { 'doubleName': context.getters.doubleName, 'encryptedLoginAttempt': encryptedLoginAttempt })
    },
    loginUserMobile (context, data) {
      context.commit('setSignedAttempt', null)
      context.commit('setFirstTime', data.firstTime)
      context.commit('setRandomImageId')
      context.commit('setIsMobile', data.mobile)
    },
    async resendNotification (context) {
      context.commit('setRandomImageId')

      let publicKey = (await userService.getUserData(context.getters.doubleName)).data.publicKey
      console.log('Public key: ', publicKey)

      let randomRoom = generateUUID()

      let locationId = window.localStorage.getItem('locationId')

      if (locationId === null) {
        locationId = generateUUID()
        window.localStorage.setItem('locationId', locationId)
      }

      console.log('locationId UUID: ', locationId)

      let encryptedLoginAttempt = await cryptoService.encrypt(JSON.stringify({
        doubleName: context.getters.doubleName,
        randomRoom: randomRoom,
        state: context.getters._state,
        scope: context.getters.scope,
        appId: context.getters.appId,
        appPublicKey: context.getters.appPublicKey,
        randomImageId: context.getters.randomImageId.toString(),
        locationId: locationId
      }), publicKey)

      socketService.emit('leave', { 'room': context.getters.randomRoom })
      context.dispatch('setrandomRoom', randomRoom)
      context.dispatch('resetTimer')
      socketService.emit('login', { 'doubleName': context.getters.doubleName, 'encryptedLoginAttempt': encryptedLoginAttempt })
    },
    sendValidationEmail (context, data) {
      var callbackUrl = `${window.location.protocol}//${window.location.host}/verifyemail`

      callbackUrl += `?state=${context.getters._state}`
      callbackUrl += `&redirecturl=${window.btoa(context.getters.redirectUrl)}`
      callbackUrl += `&doublename=${context.getters.doubleName}`

      if (context.getters.scope) callbackUrl += `&scope=${encodeURIComponent(context.getters.scope)}`
      if (context.getters.appPublicKey) callbackUrl += `&publickey=${context.getters.appPublicKey}`
      callbackUrl += (context.getters.appId) ? `&appid=${context.getters.appId}` : `&appid=${window.location.hostname}`

      axios.post(`${config.openkycurl}verification/send-email`, {
        'user_id': context.getters.doubleName,
        'email': data.email,
        'callback_url': callbackUrl,
        'public_key': context.getters.keys.publicKey
      }).then(x => {
        console.log(`Mail has been sent`)
      }).catch(e => {
        alert(e)
      })
    },
    validateEmail (context, data) {
      console.log(`Validating email`, data)
      if (data && data.userId && data.verificationCode) {
        context.commit('setEmailVerificationStatus', {
          checked: false,
          checking: true,
          valid: false
        })
        axios.post(`${config.openkycurl}verification/verify-email`, {
          user_id: data.userId,
          verification_code: data.verificationCode
        }).then(message => {
          axios.post(`${config.openkycurl}verification/verify-sei`, {
            signedEmailIdentifier: message.data
          }).then(response => {
            if (response.data.identifier === data.userId) {
              axios.post(`${config.apiurl}api/users/${data.userId}/emailverified`)
              context.commit('setEmailVerificationStatus', {
                checked: true,
                checking: false,
                valid: true
              })
            }
          })
        }).catch(e => {
          context.commit('setEmailVerificationStatus', {
            checked: true,
            checking: false,
            valid: false
          })
        })
      }
    },
    SOCKET_emailverified (context) {
      context.commit('setEmailVerificationStatus', {
        checked: true,
        checking: false,
        valid: true
      })
    },
    setScope (context, scope) {
      context.commit('setScope', scope)
    },
    setAppId (context, appId) {
      context.commit('setAppId', appId)
    },
    setAppPublicKey (context, appPublicKey) {
      context.commit('setAppPublicKey', appPublicKey)
    },
    setState (context, _state) {
      context.commit('setState', _state)
    }
  },
  getters: {
    doubleName: state => state.doubleName,
    nameCheckStatus: state => state.nameCheckStatus,
    keys: state => state.keys,
    _state: state => state._state,
    redirectUrl: state => state.redirectUrl,
    scannedFlagUp: state => state.scannedFlagUp,
    cancelLoginUp: state => state.cancelLoginUp,
    signedAttempt: state => state.signedAttempt,
    firstTime: state => state.firstTime,
    emailVerificationStatus: state => state.emailVerificationStatus,
    scope: state => state.scope,
    appId: state => state.appId,
    appPublicKey: state => state.appPublicKey,
    isMobile: state => state.isMobile,
    randomImageId: state => state.randomImageId,
    randomRoom: state => state.randomRoom,
    loginTimestamp: state => state.loginTimestamp,
    loginTimeleft: state => state.loginTimeleft,
    loginTimeout: state => state.loginTimeout,
    loginInterval: state => state.loginInterval
  }
})

function generateUUID () {
  var d = new Date().getTime()
  var d2 = (performance && performance.now && (performance.now() * 1000)) || 0

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16
    if (d > 0) {
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
