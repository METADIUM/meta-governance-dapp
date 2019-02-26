import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class Gov {
  async init ({ web3, netid }) {
    this.addresses = getAddresses(netid)
    const { GOV_ADDRESS } = this.addresses
    this.govAbi = await getABI(getBranch(netid), 'Gov')
    this.govInstance = new web3.eth.Contract(this.govAbi.abi, GOV_ADDRESS)
  }

  async getBallotLength () {
    if (!this.govInstance || !this.govInstance.methods) return
    return await this.govInstance.methods.ballotLength().call()
  }

  /**
   *
   * @param {address} addr
   */
  async isMember (addr) {
    if (!this.govInstance || !this.govInstance.methods) return
    return await this.govInstance.methods.isMember(addr).call()
  }
}
export { Gov }
