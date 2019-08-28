# PKID

## Concept
PKID is a public Key Indexed Datastore. You can save plain or encrypted data in a public key index; as long as you are the owner of the secret corresponding to that public key.

# install

```
npm install pkid
```

# initialize

```
const pkid = require('pkid')
const client = new pkid(url)
```

# Routes

## Document storage
### Set document

```
client.setDocument(pk, key, document)
```

Set the value of a document corresponding to {key} indexed by the public key {pk}.

pk is hex encoded;
request data is a base64 encoded and signed;
header is base64 encoded and signed;


### Get document

```
client.getDocument(pk, key)
```

pk is hex encoded;
response data is base64 encoded;

Get the value of a document corresponding to {key} indexed by the public key {pk}. There is no requirement for a security header

