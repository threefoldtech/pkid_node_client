const { expect, assert } = require("chai")
const Pkid = require("../src")
const Util = require("../src/util")
const testUrl = "https://pkid.staging.jimber.org"
const sodium = require("libsodium-wrappers")
describe("PkidAfterRestore", () => {
  let client
  let keyPair
  let primaryKey
  let value
  let seed

  beforeEach(async () => {
    await sodium.ready
    seed = new Uint8Array([
      73,
      202,
      32,
      7,
      30,
      211,
      70,
      56,
      220,
      239,
      67,
      215,
      154,
      191,
      117,
      222,
      146,
      149,
      180,
      208,
      36,
      14,
      194,
      123,
      40,
      43,
      207,
      142,
      9,
      87,
      112,
      134
    ])
    keyPair = await sodium.crypto_sign_seed_keypair(seed)

    client = new Pkid(testUrl, keyPair)

    primaryKey = "lkc1qezcefnvo1a6"
    value = "7v1fv19g1h34rl7ggmi46slhvbh4ryjq3qdr1zndoo25j4u7rquu0v474dxwmspj"
  })

  // Used to publish the document
  // it("should be able to set document", async () => {
  //   const result = await client.setDoc(primaryKey, value)
  //   console.log(result)
  //   expect(result)
  //     .to.be.an("object")
  //     .that.includes.keys("status", "data")
  //   expect(result.status).to.be.equal(200)
  //   expect(result.data.message).to.be.equal("succes")
  // })
  it('should be able to get a previously set value', async () => {
    const result = await client.getDoc(keyPair.publicKey, primaryKey)

    expect(result).to.be.an('object').that.includes.keys('verified', 'data')
    expect(result.verified).to.be.equal(true)
    expect(result.data).to.be.equal(value)
  })
})
