const Pkid = require('../src')
const nacl = require('tweetnacl')

const sign = nacl.sign.keyPair()
const box = nacl.box.keyPair()
const client = new Pkid('http://localhost:8080', sign.publicKey, sign.secretKey, box.publicKey, box.secretKey)

const key = 'something'
const payload = 'test'

console.log(key)

// client.setDoc(key, payload, true).then(r => {
//   console.log(r)
//   client.getDoc(sign.publicKey, key).then(r => {
//     console.log(r)
//   }).catch(e => {
//     console.log(e)
//   })
// }).catch(e => {
//   console.error(e)
// })

var assert = require('assert')

describe('Pkid', function () {
  it('should be able to set document', function (done) {
    client.setDoc(key, payload, false).then(r => {
      assert.ok(true)
      done()
    }).catch(e => {
      console.error(e)
      assert.fail()
    })
  })

  it('should be able get a previosly set document', function (done) {
    client.getDoc(sign.publicKey, key).then(r => {
      assert.strictEqual(r.data, payload)
      done()
    }).catch(e => {
      console.log(e)
      assert.fail()
      done(e)
    })
  })

  it('should be able to encrypt a document', function (done) {
    client.getDoc(sign.publicKey, key, true).then(r => {
      assert.strictEqual(r.data, payload)
      done()
    }).catch(e => {
      console.log(e)
      assert.fail()
      done(e)
    })
  })

  it('should be able to decrypt a previosly set document', function (done) {
    client.setDoc(key, payload, true).then(r => {
      assert.ok(true)
      done()
    }).catch(e => {
      console.error(e)
      assert.fail()
    })
  })
})
