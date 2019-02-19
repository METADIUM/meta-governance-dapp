import { getAddresses } from "../addresses";
import { getBranch, getABI } from '../helpers'

class EnvStorage {
    async init ({ web3, netid }) {
        this.addresses = getAddresses(netid)
        const { ENV_STORAGE_ADDRESS } = this.addresses
        this.envStorageAbi = await getABI(getBranch(netid), 'EnvStorage')
        this.envStorageInstance = new web3.eth.Contract(this.envStorageAbi.abi, ENV_STORAGE_ADDRESS)
    }
}
export { EnvStorage }