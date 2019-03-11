import React from 'react'
import { Layout, Modal } from 'antd'
import { TopNav, FootNav } from './components/Nav'
import { StakingModal } from './components/StakingModal'
import { ErrModal } from './components/ErrorModal'
import { Voting } from './components/Voting'
import { Authority } from './components/Authority'
import { BaseLoader } from './components/BaseLoader'

import * as util from './util'
import { constants } from './ethereum/constants'
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
    amount: '1',
    eventsWatch: null,
    authorityOriginData: [],
    errTitle: '',
    errContent: '',
    isMember: false
  }
  state = {
    loadWeb3: false,
    nav: '1',
    contractReady: false,
    stakingModalVisible: false,
    buttonLoading: false,
    errVisible: false,
    newProposal: false,
    stakingInvalidErr: false
  };

  constructor (props) {
    super(props)
    /* Get web3 instance. */
    getWeb3Instance().then(async web3Config => {
      console.log(web3Config)
      this.initContracts(web3Config.web3)
      await this.initAuthorityLists()
      this.setState({ loadWeb3: true })
    }, async error => {
      console.log('getWeb3 error: ', error)
      this.setState({ loadWeb3: false })
    })
  }
  async initAuthorityLists () {
    this.data.authorityOriginData = await util.getAuthorityLists(constants.authorityRepo.org, constants.authorityRepo.repo, constants.authorityRepo.branch, constants.authorityRepo.source)
    Object.keys(this.data.authorityOriginData).forEach((index) => {
      this.data.authorityOriginData[index].addr = web3Instance.web3.utils.toChecksumAddress(this.data.authorityOriginData[index].addr)
    })
  }
  
  async updateDefaultAccount(account){
    if(web3Instance.defaultAccount.toLowerCase() !== account.toLowerCase() ){
      console.log("change address:",account);
      web3Instance.defaultAccount = account;
      await this.updateAccountBalance();
      this.setStakingEventsWatch();
      //TODO: check new
      this.setState({newProposal: false})
    }else{
      console.log("notChanged");
    }
  }

  setStakingEventsWatch(address){
    if (this.data.eventsWatch ){
      let subscription = this.data.eventsWatch;
      subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
      });
    }
    var filteraddress = web3Instance.web3.eth.abi.encodeParameter('address', web3Instance.defaultAccount);
    var updateAccountBalanceForRefresh = this.updateAccountBalance.bind(this);
    this.data.eventsWatch = contracts.staking.stakingInstance.events.allEvents(
      {
        fromBlock: 'latest',
        topics: [
          null,
          filteraddress
        ]
      },
      (error, events) => { 
        console.log(events); 
        if(error){
          console.log("error", error)
        }else {
          updateAccountBalanceForRefresh()
        }
      }
    )
    console.log("Successfully subscribed!");
  }

  async updateAccountBalance(){
    this.data.balance = await contracts.staking.balanceOf(web3Instance.defaultAccount)
      this.data.lockedBalance = await contracts.staking.lockedBalanceOf(web3Instance.defaultAccount)
      this.data.balance = web3Instance.web3.utils.fromWei(this.data.balance, 'ether')
      this.data.lockedBalance = web3Instance.web3.utils.fromWei(this.data.lockedBalance, 'ether')
      this.data.isMember = await contracts.gov.isMember(web3Instance.defaultAccount)
      this.setState({ stakingModalVisible: false, buttonLoading: false })
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
      this.setStakingEventsWatch();
      this.data.isMember = await contracts.gov.isMember(web3Instance.defaultAccount)
    })
  }

  onMenuClick = ({ key }) => { this.setState({ nav: key }) }

  getErrModal = (_err = 'Unknown Error', _title = 'Unknown Error') => {
    console.log(typeof(_err))
    if(_err.includes('error:')) _err = _err.split('error:')[1]

    this.data.errTitle = _title
    this.data.errContent = _err
    this.setState({errVisible: true})
  }

  getContent () {
    if (!this.state.loadWeb3) return
    switch (this.state.nav) {
      case '1': return <Authority
        title='Authority'
        contracts={contracts}
        getErrModal={this.getErrModal}
        authorityOriginData={this.data.authorityOriginData}
        buttonLoading={this.state.buttonLoading}
        convertButtonLoading={this.convertButtonLoading}/>
      case '2': return <Voting
        title='Voting' contracts={contracts}
        getErrModal={this.getErrModal}
        authorityOriginData={this.data.authorityOriginData}
        convertComponent={this.convertVotingComponent}
        newProposal={this.state.newProposal}
        buttonLoading={this.state.buttonLoading}
        convertButtonLoading={this.convertButtonLoading}
        isMember={this.data.isMember}/>
      default:
    }
    this.setState({ selectedMenu: true })
  }

  convertVotingComponent = (component) => {
    switch(component) {
      case 'voting': this.setState({newProposal: false}); break
      case 'proposal': this.setState({newProposal: true}); break
    }
  }

  convertButtonLoading = (state) => {
    if(typeof(state) === 'boolean') {
      console.log("button loading", state)
      this.setState({ buttonLoading: state })
    } 
  }

  submitMetaStaking = (e) => {
    if(!/^[1-9]\d*$/.test(this.data.amount)) {
      this.setState({ stakingModalVisible: false })
      this.getErrModal('The staking amount format is incorrect.', 'Staking Error')
      return
    }

    this.setState({buttonLoading: true})
    let trx = {}
    console.log("before this.data.amount;",this.data.amount )
    let amount = web3Instance.web3.utils.toWei(this.data.amount, 'ether')
    console.log("after this.data.amount;", amount )
    if (this.data.selectedStakingTopic === 'deposit') {
      console.log("Send Transaction for deposit");
      trx = contracts.staking.deposit()
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        value: amount,
        to: trx.to,
        data: trx.data
      },  async (err, hash) => {
        if (err) {
          this.getErrModal(err.message, 'Deposit Error')
          this.setState({ stakingModalVisible: false, buttonLoading: false })
        } else {
          console.log('hash: ', hash)
        }
      })
    } else {
      trx = contracts.staking.withdraw(amount)
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, async (err, hash) => {
        if (err) {
          this.getErrModal(err.message, 'Withdraw Error')
          this.setState({ stakingModalVisible: false, buttonLoading: false })
        } else {
          console.log('hash: ', hash)
        }
      })
    }
  }

  handleSelectChange = (e) => {
    this.data.selectedStakingTopic = e
    this.setState({})
  }

  handleInputChange = (e) => {
    this.data.amount = e.target.value
    if(/^[1-9]([0-9]*)$/.test(e.target.value)) this.setState({stakingInvalidErr: false})
    else this.setState({stakingInvalidErr: true})
  }

  showStakingModal = () => {
    this.data.amount = '1'
    this.data.selectedStakingTopic = 'deposit'
    this.setState({ stakingModalVisible: true })
  }

  render () {
    return (
      <Layout className='layout'>
        {this.state.contractReady && this.state.loadWeb3
          ? <div>
            <Header>
              <TopNav
                nav={this.state.nav}
                onMenuClick={this.onMenuClick}
                showStakingModal={this.showStakingModal}
                balance={this.data.balance}
                lockedBalance={this.data.lockedBalance} />
            </Header>

            <StakingModal
              accountBalance={{ balance: this.data.balance, lockedBalance: this.data.lockedBalance }}
              stakingModalVisible={this.state.stakingModalVisible}
              hideStakingModal={() => {if(!this.state.buttonLoading) this.setState({ stakingModalVisible: false })}}
              submitMetaStaking={this.submitMetaStaking}
              handleInputChange={this.handleInputChange}
              handleSelectChange={this.handleSelectChange}
              stakingLoading={this.state.buttonLoading}
              amount={this.data.amount}
              selectedStakingTopic={this.data.selectedStakingTopic}
              stakingInvalidErr={this.state.stakingInvalidErr} />

            <ErrModal
              title={this.data.errTitle}
              err={this.data.errContent}
              visible={this.state.errVisible}
              coloseErrModal = {() => this.setState({ errVisible: !this.state.loadWeb3})} />

            <Content style={{ backgroundColor: '##EEEEF0' }}>
              {this.state.loadWeb3
                ? <div> {this.getContent()} </div>
                : this.getErrModal('This is an unknown network. Please connect to Metadium network', 'Connecting Error')
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
