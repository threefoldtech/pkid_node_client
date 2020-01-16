const axios = require('axios')
const { sign } = require('tweetnacl')
const {
  encodeUTF8,
  decodeBase64
} = require('tweetnacl-util')
const { decrypt, encodeHex, encrypt, signEncode } = require('./util')

const ApiVersion = `v1`

class Pkid {

  constructor (nodeUrl, keyPair) {
    this.nodeUrl = nodeUrl
    this.keyPair = keyPair
  }

  async getDoc (signPk, key) {

    let res;
    try {
      res = await axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `${this.nodeUrl}/v1/documents/${encodeHex(signPk)}/${key}`
      })
    } catch (e) {
      console.error(e)
      return e.response.data
    }

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

      let decryptedData
      try {
        decryptedData = await decrypt(data.payload, this.keyPair.publicKey, this.keyPair.privateKey)
      } catch (e) {
      }
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
  }

  async setDoc (key, payload, willEncrypt = false, publicKey = null) {
    const header = {
      intent: 'pkid.store',
      timestamp: (new Date()).getTime()
    }

    const encryptionPublicKey = publicKey ? publicKey : this.keyPair.publicKey

    const handledPayload = willEncrypt ? await encrypt(payload, encryptionPublicKey) : payload

    const payloadContainer = {
      is_encrypted: Boolean(willEncrypt),
      payload: handledPayload
    }

    try {
      return await axios({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: signEncode(header, this.keyPair.privateKey)
        },
        data: JSON.stringify(signEncode(payloadContainer, this.keyPair.privateKey)),
        url: `${this.nodeUrl}/${ApiVersion}/documents/${encodeHex(this.keyPair.publicKey)}/${key}`
      })
    } catch (e) {
      return e
    }
  }
}

module.exports = Pkid
