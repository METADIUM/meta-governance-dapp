import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class EnvStorage {
  async init ({ web3, netId }) {
    this.addresses = getAddresses(netId)
    const { ENV_STORAGE_ADDRESS } = this.addresses
    this.envStorageAbi = await getABI(getBranch(netId), 'EnvStorage')
    this.envStorageInstance = new web3.eth.Contract(this.envStorageAbi.abi, ENV_STORAGE_ADDRESS)
  }

  getStakingMin () {
    if (!this.envStorageInstance || !this.envStorageInstance.methods) return
    return this.envStorageInstance.methods.getStakingMin().call()
  }

  getStakingMax () {
    if (!this.envStorageInstance || !this.envStorageInstance.methods) return
    return this.envStorageInstance.methods.getStakingMax().call()
  }
}
export { EnvStorage }
