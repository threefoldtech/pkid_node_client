import * as Util from "../src/util"

describe('Util', () => {
  it('should generate a keypair', async () => {
    const keyPair = await Util.generateKeypair()
    expect(keyPair).toHaveProperty('publicKey')
    expect(keyPair).toHaveProperty('privateKey')
    console.log(keyPair)
    expect(keyPair.privateKey).toBeInstanceOf(Uint8Array)
    expect(keyPair.publicKey).toBeInstanceOf(Uint8Array)
  })
})
