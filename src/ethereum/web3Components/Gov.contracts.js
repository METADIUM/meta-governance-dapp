import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class Gov {
  async init ({ web3, netId }) {
    this.addresses = getAddresses(netId)
    const { GOV_ADDRESS } = this.addresses
    this.govAbi = await getABI(getBranch(netId), 'Gov')
    this.govInstance = new web3.eth.Contract(this.govAbi.abi, GOV_ADDRESS)
  }

  getBallotLength () {
    if (!this.govInstance || !this.govInstance.methods) return
    return this.govInstance.methods.ballotLength().call()
  }

  /**
   *
   * @param {address} addr
   */
  isMember (addr) {
    if (!this.govInstance || !this.govInstance.methods) return
    return this.govInstance.methods.isMember(addr).call()
  }
}
export { Gov }
