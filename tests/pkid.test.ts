import Pkid from "../src"
import * as Util from "../src/util"


const testUrl = 'http://localhost:8080'

describe('Pkid', () => {

  let client
  let secondClient
  let keyPair
  let secondKeyPair
  let primaryKey
  let value

  beforeEach(async () => {
    keyPair = await Util.generateKeypair()
    secondKeyPair = await Util.generateKeypair()
    client = new Pkid(testUrl, keyPair)
    secondClient = new Pkid(testUrl, secondKeyPair)

    primaryKey = [...Array(16)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
    value = [...Array(64)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
  })

  it('should be able to be instantiated', () => {
    const pkid = new Pkid(testUrl, keyPair)
    expect(pkid).toBeInstanceOf(Object)
  })
  it('should be able to set document', async () => {
    const result = await client.setDoc(primaryKey, value)
    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('data')
    expect(result.status).toEqual(200)
    expect(result.data.message).toEqual('succes')
  })
  it('should be able to get a previously set value', async () => {
    await client.setDoc(primaryKey, value)
    const result = await client.getDoc(keyPair.publicKey, primaryKey)

    expect(result).toHaveProperty('verified')
    expect(result).toHaveProperty('data')
    expect(result.verified).toEqual(true)
    expect(result.data).toEqual(value)
  })
  it('should be able to set and encrypt a document', async () => {
    const result = await client.setDoc(primaryKey, value,true)
    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('data')
    expect(result.status).toEqual(200)
    expect(result.data.message).toEqual('succes')
  })
  it('should be able to get and decrypt a previously set and encrypted value', async () => {
    await client.setDoc(primaryKey, value,true)
    const result = await client.getDoc(keyPair.publicKey, primaryKey)

    expect(result).toHaveProperty('decrypted')
    expect(result).toHaveProperty('verified')
    expect(result).toHaveProperty('data')
    expect(result.verified).toEqual(true)
    expect(result.decrypted).toEqual(true)
    expect(result.data).toEqual(value)
  })
  it('should be able to set and encrypte a value with a diffrent keypair', async () => {
    expect(keyPair.privateKey).not.toEqual(secondKeyPair.privateKey)

    const result = await client.setDoc(primaryKey, value,true, secondKeyPair.publicKey)
    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('data')
    expect(result.status).toEqual(200)
    expect(result.data.message).toEqual('succes')
  })
  it('should be able to get and decrypt a previously set and encrypted value by another keypair by that pair', async () => {
    await client.setDoc(primaryKey, value,true, secondKeyPair.publicKey)
    const result = await secondClient.getDoc(keyPair.publicKey, primaryKey)

    expect(result).toHaveProperty('decrypted')
    expect(result).toHaveProperty('verified')
    expect(result).toHaveProperty('data')
    expect(result.verified).toEqual(true)
    expect(result.decrypted).toEqual(true)
    expect(result.data).toEqual(value)
  })
  it('should not be able to get and decrypt a previously set and encrypted value by another keypair by another pair', async () => {
    await client.setDoc(primaryKey, value,true)
    const result = await secondClient.getDoc(keyPair.publicKey, primaryKey)

    expect(result).toHaveProperty('decrypted')
    expect(result).toHaveProperty('verified')
    expect(result).not.toHaveProperty('data')
    expect(result.verified).toEqual(true)
    expect(result.decrypted).toEqual(false)
  })
  it('should not be able to get a value which is not yet set', async () => {
    const result = await client.getDoc(keyPair.publicKey, primaryKey)
    console.log(result)

    expect(result).not.toHaveProperty('success')
    expect(result).not.toHaveProperty('data')
    expect(result.success).not.toEqual(true)
  })
  it('should be able to get a previously set array value', async () => {
    value = [{
      test: value
    }]
    await client.setDoc(primaryKey, value)
    const result = await client.getDoc(keyPair.publicKey, primaryKey)

    expect(result).toHaveProperty('verified')
    expect(result).toHaveProperty('data')
    expect(result.verified).toEqual(true)
    expect(result.data[0].test).toEqual(value[0].test)
  })
  it('should be able to get and decrypt a previously set and encrypted array value by another keypair by that pair', async () => {
    value = [{
      test: value
    }]
    await client.setDoc(primaryKey, value,true, secondKeyPair.publicKey)
    const result = await secondClient.getDoc(keyPair.publicKey, primaryKey)

    expect(result).toHaveProperty('decrypted')
    expect(result).toHaveProperty('verified')
    expect(result).toHaveProperty('data')
    expect(result.verified).toEqual(true)
    expect(result.decrypted).toEqual(true)
    expect(result.data).toEqual(value)
  })
})
