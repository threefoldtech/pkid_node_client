const Pkid = require('../src')
const nacl = require('tweetnacl')

const sign = nacl.sign.keyPair()
const box = nacl.box.keyPair()
const client = new Pkid('http://localhost:8080', sign.publicKey, sign.secretKey, box.publicKey, box.secretKey)

const key = 'something'
const payload = 'test'

console.log(key)

client.setDoc(key, payload, true).then(r => {
  console.log(r)
  client.getDoc(sign.publicKey, key).then(r => {
    console.log(r)
  }).catch(e => {
    console.log(e)
  })
}).catch(e => {
  console.error(e)
})
