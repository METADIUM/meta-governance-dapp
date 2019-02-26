import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class Staking {
  async init ({ web3, netid }) {
    this.addresses = getAddresses(netid)
    const { STAKING_ADDRESS } = this.addresses
    this.stakingAbi = await getABI(getBranch(netid), 'Staking')
    this.stakingInstance = new web3.eth.Contract(this.stakingAbi.abi, STAKING_ADDRESS)
  }

  async getBalance(address) {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    let lockedBalance = await this.stakingInstance.methods.lockedBalanceOf(address).call()
    let balance = await this.stakingInstance.methods.balanceOf(address).call()
    return {balance, lockedBalance}
  }
}
export { Staking }
