import React from 'react'
import { Layout, Modal, Tabs } from 'antd'
import { TopNav, FootNav } from './components/Nav'
import { StakingModal } from './components/StakingModal'
import { Voting } from './components/Voting'
import { Authority } from './components/Authority'
import './App.css'

// web3
import getWeb3Instance from './ethereum/web3'
import { web3Instance } from './ethereum/web3'
import Web3 from 'web3'



// Contracts
import { contracts, initContracts } from './ethereum/web3Components/contracts'

const { Header, Content, Footer } = Layout
const TabPane = Tabs.TabPane

class App extends React.Component {
  state = {
    loadWeb3: false,
    nav: '1',
    contractReady: false,
    balance: 0,
    lockedBalance: 0,
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

  async initContracts (web3) {
    initContracts({
      web3: web3,
      netid: web3.netid
    }).then(async () => {
      let {balance, lockedBalance} = await contracts.staking.getBalance(web3Instance.defaultAccount)
      this.setState({ contractReady: true, balance, lockedBalance })
  })
  }

  onMenuClick = ({key}) => {
    this.setState({ nav: key })
    console.log(key)
  }

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
    this.setState({ selectedMenu: true})
  }

  showStakingModal = (e) => {
    this.setState({
      stakingModalVisible: true,
    });
  }

  hideStakingModal = (e) => {
    this.setState({
      stakingModalVisible: false,
    });
  }

  submitMetaStaing = (e) => {
    this.setState({
      stakingModalVisible: false,
    });
  }

  render () {
    return (
      <Layout className='layout'>
        <Header>
          <TopNav
            nav={ this.state.nav}
            onMenuClick={ this.onMenuClick }
            showStakingModal={ this.showStakingModal }
            balance={this.state.balance}
            lockedBalance={this.state.lockedBalance}/>
        </Header>

        <StakingModal
          stakingModalVisible={ this.state.stakingModalVisible}
          hideStakingModal={ this.hideStakingModal }
          submitMetaStaing = { this.submitMetaStaing } />

        <Content style={{ backgroundColor: 'white' }}>
          {this.state.loadWeb3
            ? <div> {this.getContent()} </div>
            : <div> { this.getErrModal()} </div>
          }
        </Content>

        <Footer>
          <FootNav/>
        </Footer>
      </Layout>
    )
  }
}

export default App
