const pkid = require('pkid')

var client = new pkid('http://localhost:8080')

// hexed public key
let pk = '00390447de04fdf6cbee6ad76425f556fcf7652b50574e6ed3b938c35bb15d46'
let key = 'aaa'

client.getDocument(pk, key).then(r => {
    console.log(r.data)
}).catch(e => {
    console.error(e.message.data)
})

// base64 encoded signed message
let data = 'JOjE95c5tQck4WYrWFEjDluSVVC55+kTnTq/o2YZfd8Gp7l9WBJ6n1u7p2HXJWrjrNz2L8x+1jXberAo6Vn+BnRlc3Q='

client.setDocument(pk, key, data).then(r => {
    console.log(r.data)
}).catch(e => {
    console.error(e.response.data)
})

