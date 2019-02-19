import { getAddresses } from "../addresses";
import { getBranch, getABI } from '../helpers'
import { Gov } from './Gov.contracts'

class BallotStorage {
    async init ({ web3, netid }) {
        this.addresses = getAddresses(netid)
        const { BALLOT_STORAGE_ADDRESS } = this.addresses
        this.ballotStorageAbi = await getABI(getBranch(netid), 'BallotStorage')
        this.ballotStorageInstance = new web3.eth.Contract(this.ballotStorageAbi.abi, BALLOT_STORAGE_ADDRESS)
    }
}
export { BallotStorage }