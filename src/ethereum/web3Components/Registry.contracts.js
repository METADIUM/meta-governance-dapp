import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class Registry {
  async init ({ web3, netId }) {
    this.addresses = getAddresses(netId)
    const { REGISTRY_ADDRESS } = this.addresses
    this.registryAbi = await getABI(getBranch(netId), 'Registry')
    this.registryInstance = new web3.eth.Contract(this.registryAbi.abi, REGISTRY_ADDRESS)
  }
}
export { Registry }
