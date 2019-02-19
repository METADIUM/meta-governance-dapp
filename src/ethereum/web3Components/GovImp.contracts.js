import { getAddresses } from "../addresses";
import { getBranch, getABI } from '../helpers'

class GovImp {
    async init ({ web3, netid }) {
        this.addresses = getAddresses(netid)
        const { GOV_ADDRESS } = this.addresses
        this.govImpAbi = await getABI(getBranch(netid), 'GovImp')
        this.govImpInstance = new web3.eth.Contract(this.govImpAbi.abi, GOV_ADDRESS)
    }

    async vote (idx, approval) {
        if (!this.govImpInstance || !this.govImpInstance.methods) return
        //await this.govImpInstance.methods.vote(idx, approval)
    }
}
export { GovImp }