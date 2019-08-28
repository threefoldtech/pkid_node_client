const axios = require('axios')

class Pkid {
	constructor(nodeUrl) {
		this.nodeUrl = nodeUrl
	}

	getDocument(pk, key) {
		return axios({
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			url: `${this.nodeUrl}/v1/documents/${pk}/${key}`,
		})
	}

	setDocument(pk, key, data) {
		return axios({
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': data,
			},
			data: JSON.stringify(data),
			url: `${this.nodeUrl}/v1/documents/${pk}/${key}`
		})
	}
}

module.exports = Pkid