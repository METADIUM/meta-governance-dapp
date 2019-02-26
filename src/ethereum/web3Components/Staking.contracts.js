import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class Staking {
  async init ({ web3, netid }) {
    this.addresses = getAddresses(netid)
    const { STAKING_ADDRESS } = this.addresses
    this.stakingAbi = await getABI(getBranch(netid), 'Staking')
    this.stakingInstance = new web3.eth.Contract(this.stakingAbi.abi, STAKING_ADDRESS)
  }

  async lockedBalanceOf(address) {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    return await this.stakingInstance.methods.lockedBalanceOf(address).call()
  }

  async availableBalanceOf(address) {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    return await this.stakingInstance.methods.availableBalanceOf(address).call()
  }

  getBalance = (address) => {
    return {
      availableBalance: this.availableBalanceOf(address),
      lockedBalance: this.lockedBalanceOf(address)
    }
  }
}
export { Staking }
