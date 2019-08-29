const axios = require('axios')
const { sign } = require('tweetnacl')
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
	decodeBase64
} = require('tweetnacl-util')
class Pkid {
	constructor(nodeUrl, pk, sk) {
		this.nodeUrl = nodeUrl
		this.pk = pk
		this.sk = sk
	}

	getDoc(pk, key) {
		return axios({
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			url: `${this.nodeUrl}/v1/documents/${encodeHex(pk)}/${key}`,
		}).then(res => {
			let verified = sign.open(decodeBase64(res.data.data), pk)
			if (verified) return {
				data: JSON.parse(encodeUTF8(verified)),
				verified: true
			}
		}).catch(e => {
			return e.response.data
		})
	}

	setDoc(key, payload) {
		let header = {
			intent: 'pkid.store',
			timestamp: (new Date).getTime()
		}
	  return axios({
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': signEncode(header, this.sk),
			},
			data: JSON.stringify(signEncode(payload, this.sk)),
			url: `${this.nodeUrl}/v1/documents/${encodeHex(this.pk)}/${key}`
		}).then(res => {
			return res.data
		}).catch(e => {
			return e.response.data
		})
	}
}

function signEncode (payload, sk) {
	let message = decodeUTF8(JSON.stringify(payload))
	return encodeBase64(sign(message, sk))
}

function encodeHex(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

module.exports = Pkid