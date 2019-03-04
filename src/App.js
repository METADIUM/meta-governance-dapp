import React from 'react'
import { Layout, Modal } from 'antd'
import { TopNav, FootNav } from './components/Nav'
import { StakingModal } from './components/StakingModal'
import { Voting } from './components/Voting'
import { Authority } from './components/Authority'
import { BaseLoader } from './components/BaseLoader'
import './App.css'

// web3
import getWeb3Instance from './ethereum/web3'
import { web3Instance } from './ethereum/web3'

// Contracts
import { contracts, initContracts } from './ethereum/web3Components/contracts'

const { Header, Content, Footer } = Layout
class App extends React.Component {
  data = {
    balance: 0,
    lockedBalance: 0,
    selectedStakingTopic: 'deposit',
    amount: 0
  }
  state = {
    loadWeb3: false,
    nav: '1',
    contractReady: false,
    stakingModalVisible: false
  };

  constructor (props) {
    super(props)
    /* Get web3 instance. */
    getWeb3Instance().then(async web3Config => {
      console.log(web3Config)
      this.initContracts(web3Config.web3)
      this.setState({ loadWeb3: true })
    }, async error => {
      console.log('getWeb3 error: ', error)
      this.setState({ loadWeb3: false })
    })
  }
  
  async updateDefaultAccount(account){
    if(web3Instance.defaultAccount.toLowerCase() !== account.toLowerCase() ){
      console.log("change address:",account);
      //alert("Update Changed:"+web3Instance.defaultAccount+" => "+ data.selectedAddress);
      web3Instance.defaultAccount = account;
      await this.updateAccountBalance();
      // stakingEventsListen = contracts.staking.stakingInstance.events.allEvents(
      //   {
      //     filter: {payee:[web3Instance.defaultAccount]},
      //     fromBlock: 'latest'
      //   }, 
      //   (error, events) => { 
      //     console.log(events); 
      //     if(error){
      //       console.log("error", error)
      //     }else {
      //       updateAccountBalanceForRefresh()
      //     }
      //   })
    }else{
      console.log("notChanged");
    }
  }
  async updateAccountBalance(){
    this.data.balance = await contracts.staking.balanceOf(web3Instance.defaultAccount)
      this.data.lockedBalance = await contracts.staking.lockedBalanceOf(web3Instance.defaultAccount)
      this.data.balance = web3Instance.web3.utils.fromWei(this.data.balance, 'ether')
      this.data.lockedBalance = web3Instance.web3.utils.fromWei(this.data.lockedBalance, 'ether')
      this.setState({ stakingModalVisible: false })
  }
  async initContracts (web3) {
    initContracts({
      web3: web3,
      netid: web3.netid
    }).then(async () => {
      await this.updateAccountBalance();
      this.setState({ contractReady: true })

      var updateAcount = this.updateDefaultAccount.bind(this);
      window.ethereum.on('accountsChanged', async function (chagedAccounts) {
        await updateAcount(chagedAccounts[0]);
      })
    })
  }

  onMenuClick = ({ key }) => { this.setState({ nav: key }) }

  getErrModal () {
    return <Modal
      title='ERROR'
      visible={!this.state.loadWeb3}
      okButtonProps={{ disabled: true }}
      cancelButtonProps={{ disabled: true }}
    >
      <p>This is an unknown network. Please connect to Metadium network</p>
    </Modal>
  }

  getContent () {
    if (!this.state.loadWeb3) return
    switch (this.state.nav) {
      case '1': return <Authority title='Authority' contracts={contracts} />
      case '2': return <Voting title='Voting' contracts={contracts} />
      default:
    }
    this.setState({ selectedMenu: true })
  }

  submitMetaStaking = (e) => {
    let trx = {}
    console.log("before this.data.amount;",this.data.amount )
    this.data.amount = web3Instance.web3.utils.toWei(this.data.amount, 'ether')
    console.log("after this.data.amount;",this.data.amount )
    if (this.data.selectedStakingTopic === 'deposit') {
      console.log("Send Transaction for deposit");
      trx = contracts.staking.deposit()
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        value: this.data.amount,
        to: trx.to,
        data: trx.data
      },  async (err, hash) => {
        if (err) console.log('err: ', err)
        else {
          console.log('hash: ', hash)
        }
      })
    } else {
      trx = contracts.staking.withdraw(this.data.amount)
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, async (err, hash) => {
        if (err) console.log('err: ', err)
        else {
          console.log('hash: ', hash)
        }
      })
    }

    
  }

  handleSelectChange = (e) => { this.data.selectedStakingTopic = e }

  handleInputChange = (e) => { this.data.amount = e.target.value }

  render () {
    return (
      <Layout className='layout'>
        {this.state.contractReady && this.state.loadWeb3
          ? <div>
            <Header>
              <TopNav
                nav={this.state.nav}
                onMenuClick={this.onMenuClick}
                showStakingModal={() => this.setState({ stakingModalVisible: true })}
                balance={this.data.balance}
                lockedBalance={this.data.lockedBalance} />
            </Header>

            <StakingModal
              accountBalance={{ balance: this.data.balance, lockedBalance: this.data.lockedBalance }}
              stakingModalVisible={this.state.stakingModalVisible}
              hideStakingModal={() => this.setState({ stakingModalVisible: false })}
              submitMetaStaking={this.submitMetaStaking}
              handleInputChange={this.handleInputChange}
              handleSelectChange={this.handleSelectChange} />

            <Content style={{ backgroundColor: '##EEEEF0' }}>
              {this.state.loadWeb3
                ? <div> {this.getContent()} </div>
                : <div> { this.getErrModal()} </div>
              }
            </Content>

            <Footer>
              <FootNav />
            </Footer>
          </div>
          :
          <div>
            <BaseLoader />
          </div>}
      </Layout>
    )
  }
}

export default App
