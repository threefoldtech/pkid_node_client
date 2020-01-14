const axios = require('axios')
const { sign, box, randomBytes } = require('tweetnacl')
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require('tweetnacl-util')

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

const newNonce = () => randomBytes(24)

const encrypt = (json, pk, sk) => {
  const nonce = newNonce()
  const messageUint8 = decodeUTF8(JSON.stringify(json))
  const boxstring = box(messageUint8, nonce, pk, sk)

  const fullMessage = new Uint8Array(nonce.length + boxstring.length)
  fullMessage.set(nonce)
  fullMessage.set(boxstring, nonce.length)

  return encodeBase64(fullMessage)
}

const decrypt = (messageWithNonce, pk, sk) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  )

  const decrypted = box.open(message, nonce, pk, sk)

  if (!decrypted) {
    return null
  }

  const base64DecryptedMessage = encodeUTF8(decrypted)
  return JSON.parse(base64DecryptedMessage)
}

function signEncode (payload, signSk) {
  const message = decodeUTF8(JSON.stringify(payload))
  return encodeBase64(sign(message, signSk))
}

function encodeHex (byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

module.exports = Pkid
