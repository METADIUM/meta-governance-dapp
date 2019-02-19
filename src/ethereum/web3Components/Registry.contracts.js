import { getAddresses } from "../addresses";
import { getBranch, getABI } from '../helpers'

class Registry {
    async init ({ web3, netid }) {
        this.addresses = getAddresses(netid)
        const { REGISTRY_ADDRESS } = this.addresses
        this.registryAbi = await getABI(getBranch(netid), 'Registry')
        this.registryInstance = new web3.eth.Contract(this.registryAbi.abi, REGISTRY_ADDRESS)
    }
}
export { Registry }