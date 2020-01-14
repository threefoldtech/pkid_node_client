const axios = require('axios')
const { sign } = require('tweetnacl')
const {
  encodeUTF8,
  decodeBase64
} = require('tweetnacl-util')
const { decrypt, encodeHex, encrypt, signEncode } = require('./util')

class Pkid {
  constructor (nodeUrl, signPk, signSk, boxPk, boxSk) {
    this.nodeUrl = nodeUrl
    this.signPk = signPk
    this.signSk = signSk
    this.boxPk = boxPk
    this.boxSk = boxSk
  }

  getDoc (signPk, key) {
    return axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `${this.nodeUrl}/v1/documents/${encodeHex(signPk)}/${key}`
    }).then(res => {
      const verified = sign.open(decodeBase64(res.data.data), signPk)
      if (!verified) {
        return {
          verified: false
        }
      }

      const data = JSON.parse(encodeUTF8(verified))

      if (!data.is_encrypted) {
        return {
          data: data.payload,
          verified: true
        }
      }

      const decryptedData = decrypt(data.payload, this.boxPk, this.boxSk)

      if (!decryptedData) {
        return {
          verified: true,
          decrypted: false
        }
      }

      return {
        data: decryptedData,
        verified: true,
        decrypted: true
      }
    }).catch(e => {
      console.error(e)
      return e.response.data
    })
  }

  setDoc (key, payload, willEncrypt = false) {
    const header = {
      intent: 'pkid.store',
      timestamp: (new Date()).getTime()
    }

    const payloadContainer = {
      is_encrypted: Boolean(willEncrypt),
      payload: willEncrypt ? encrypt(payload, this.boxPk, this.boxSk) : payload
    }

    return axios({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: signEncode(header, this.signSk)
      },
      data: JSON.stringify(signEncode(payloadContainer, this.signSk)),
      url: `${this.nodeUrl}/v1/documents/${encodeHex(this.signPk)}/${key}`
    }).then(res => {
      return res.data
    }).catch(e => {
      return e.response.data
    })
  }
}

module.exports = Pkid
