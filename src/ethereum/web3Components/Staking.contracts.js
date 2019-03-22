import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class Staking {
  async init ({ web3, netId }) {
    this.addresses = getAddresses(netId)
    const { STAKING_ADDRESS } = this.addresses
    this.stakingAbi = await getABI(getBranch(netId), 'Staking')
    this.stakingInstance = new web3.eth.Contract(this.stakingAbi.abi, STAKING_ADDRESS)
  }

  lockedBalanceOf (address) {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    return this.stakingInstance.methods.lockedBalanceOf(address).call()
  }

  balanceOf (address) {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    return this.stakingInstance.methods.balanceOf(address).call()
  }

  availableBalanceOf (address) {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    return this.stakingInstance.methods.availableBalanceOf(address).call()
  }

  deposit () {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    return {
      to: this.addresses.STAKING_ADDRESS,
      data: this.stakingInstance.methods.deposit().encodeABI()
    }
  }

  withdraw (amount) {
    if (!this.stakingInstance || !this.stakingInstance.methods) return
    return {
      to: this.addresses.STAKING_ADDRESS,
      data: this.stakingInstance.methods.withdraw(amount).encodeABI()
    }
  }
}
export { Staking }
