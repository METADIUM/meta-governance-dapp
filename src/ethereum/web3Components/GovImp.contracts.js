import { getAddresses } from '../addresses'
import { getBranch, getABI } from '../helpers'

class GovImp {
  async init ({ web3, netid }) {
    this.addresses = getAddresses(netid)
    const { GOV_ADDRESS } = this.addresses
    this.govImpAbi = await getABI(getBranch(netid), 'GovImp')
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
   * @param {bytes} enode 
   * @param {bytes} ip 
   * @param {uint} port 
   * @param {uint256} lockAmount 
   * @param {bytes} memo 
   */
  addProposalToAddMember(member, enode, ip, port, lockAmount, memo) {
    if (!this.govImpInstance || !this.govImpInstance.methods) return
    console.log(this.govImpInstance.methods.addProposalToAddMember(member, enode, ip, port, lockAmount, memo))
    return {
      to: this.addresses.GOV_ADDRESS,
      data: this.govImpInstance.methods.addProposalToAddMember(member, enode, ip, port, lockAmount, memo).encodeABI()
    }
  }

  /**
   * 
   * @param {address} target 
   * @param {address} nMember 
   * @param {bytes} nEnode 
   * @param {bytes} nIp 
   * @param {uint} nPort 
   * @param {uint256} lockAmount 
   * @param {bytes} memo 
   */
  addProposalToChangeMember(target, nMember, nEnode, nIp, nPort, lockAmount, memo) {
    if (!this.govImpInstance || !this.govImpInstance.methods) return
    return {
      to: this.addresses.GOV_ADDRESS,
      data: this.govImpInstance.methods.addProposalToChangeMember(target, nMember, nEnode, nIp, nPort, lockAmount, memo).encodeABI()
    }
  }
}
export { GovImp }
