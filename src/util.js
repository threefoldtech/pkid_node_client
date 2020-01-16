const {
  randomBytes
} = require('tweetnacl')
const sodium = require('libsodium-wrappers')
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require('tweetnacl-util')

const encrypt = async (json, bobPublicKey) => {
  await sodium.ready
  const message = decodeUTF8(JSON.stringify(json))

  bobPublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(bobPublicKey)
  const encryptedMessage = sodium.crypto_box_seal(message, bobPublicKey)

  return encodeBase64(encryptedMessage)
}

const decrypt = async (ciphertext, bobPublicKey, bobSecretKey) => {
  await sodium.ready

  ciphertext = decodeBase64(ciphertext)

  bobPublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(bobPublicKey)
  bobSecretKey = sodium.crypto_sign_ed25519_sk_to_curve25519(bobSecretKey)

  const decrypted = sodium.crypto_box_seal_open(ciphertext, bobPublicKey, bobSecretKey)

  if (!decrypted) {
    return null
  }

  const base64DecryptedMessage = encodeUTF8(decrypted)
  return base64DecryptedMessage
}

const sign = (message, privateKey) => {
  return sodium.crypto_sign(message, privateKey)
}

const signEncode = (payload, secretKey) => {
  const message = decodeUTF8(JSON.stringify(payload))

  return encodeBase64(sign(message, secretKey))
}

const encodeHex = byteArray => Array.from(
  byteArray,
  byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)
).join('')

const generateKeypair = async (keySeed = null) => {
  await sodium.ready
  return await sodium.crypto_sign_keypair(keySeed)
}
module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  signEncode: signEncode,
  encodeHex: encodeHex,
  generateKeypair: generateKeypair,
}
