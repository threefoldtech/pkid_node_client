const pkid = require('@jimber/pkid')
const nacl = require('tweetnacl')

sign = nacl.sign.keyPair()

var client = new pkid('http://localhost:8080', sign.publicKey, sign.secretKey)

let key = 'aaa'
let payload = 'test'

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
