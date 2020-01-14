const Pkid = require('@jimber/pkid')
const nacl = require('tweetnacl')

const sign = nacl.sign.keyPair()

const client = new Pkid('http://localhost:8080', sign.publicKey, sign.secretKey)

const key = 'aaa'
const payload = 'test'

client.setDoc(key, payload).then(r => {
  console.log(r)
}).catch(e => {
  console.error(e)
})

setTimeout(() => {
  client.getDoc(sign.publicKey, key).then(r => {
    console.log(r)
  }).catch(e => {
    console.log(e)
  })
}, 1500)
