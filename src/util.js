const { sign, box, randomBytes } = require('tweetnacl')
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require('tweetnacl-util')

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

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  signEncode: signEncode,
  encodeHex: encodeHex
}
