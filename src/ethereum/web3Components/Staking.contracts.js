import { getAddresses } from "../addresses";
import { getBranch, getABI } from '../helpers'

class Staking {
    async init ({ web3, netid }) {
        this.addresses = getAddresses(netid)
        const { STAKING_ADDRESS } = this.addresses
        this.stakingAbi = await getABI(getBranch(netid), 'Staking')
        this.stadingInstance = new web3.eth.Contract(this.stakingAbi.abi, STAKING_ADDRESS)
    }
}
export { Staking }