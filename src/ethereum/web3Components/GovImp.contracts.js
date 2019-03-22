import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class GovImp {
  async init ({ web3, netId }) {
    this.addresses = getAddresses(netId)
    const { GOV_ADDRESS } = this.addresses
    this.govImpAbi = await getABI(getBranch(netId), 'GovImp')
    this.govImpInstance = new web3.eth.Contract(this.govImpAbi.abi, GOV_ADDRESS)
  }

  /**
   *
   * @param {uint256} idx
   * @param {boolean} approval
   */
  vote (idx, approval) {
    if (!this.govImpInstance || !this.govImpInstance.methods) return
    return {
      to: this.addresses.GOV_ADDRESS,
      data: this.govImpInstance.methods.vote(idx, approval).encodeABI()
    }
  }

  /**
   *
   * @param {address} member
   * @param {bytes} name
   * @param {bytes} enode
   * @param {bytes} ip
   * @param {uint256[2]} [port, lockAmount]
   * @param {bytes} memo
   */
  addProposalToAddMember (member, name, enode, ip, [port, lockAmount], memo) {
    if (!this.govImpInstance || !this.govImpInstance.methods) return
    return {
      to: this.addresses.GOV_ADDRESS,
      data: this.govImpInstance.methods.addProposalToAddMember(member, name, enode, ip, [port, lockAmount], memo).encodeABI()
    }
  }

  /**
   *
   * @param {address} [target, nMember]
   * @param {bytes} nName
   * @param {bytes} nEnode
   * @param {bytes} nIp
   * @param {uint} [nPort, ockAmount]
   * @param {bytes} memo
   */
  addProposalToChangeMember ([target, nMember], nName, nEnode, nIp, [nPort, lockAmount], memo) {
    if (!this.govImpInstance || !this.govImpInstance.methods) return
    return {
      to: this.addresses.GOV_ADDRESS,
      data: this.govImpInstance.methods.addProposalToChangeMember([target, nMember], nName, nEnode, nIp, [nPort, lockAmount], memo).encodeABI()
    }
  }

  /**
   *
   * @param {address} member
   * @param {uint256} lockAmount
   * @param {bytes} memo
   */
  addProposalToRemoveMember (member, lockAmount, memo) {
    if (!this.govImpInstance || !this.govImpInstance.methods) return
    return {
      to: this.addresses.GOV_ADDRESS,
      data: this.govImpInstance.methods.addProposalToRemoveMember(member, lockAmount, memo).encodeABI()
    }
  }
}
export { GovImp }
