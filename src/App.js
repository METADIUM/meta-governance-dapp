import React from 'react'
import { Layout, Button, Row, Col, Modal, Tabs } from 'antd'
import { Voting } from './components/Voting'
import { Authority } from './components/Authority'
import './App.css';


//web3
import getWeb3Instance from '../src/ethereum/web3'

const { Header, Content, Footer } = Layout;
const TabPane = Tabs.TabPane;

class App extends React.Component {
  state = {
    loadWeb3: false,
    nav: '2',
  };

  constructor (props) {
    super(props);

    // Get web3 instance
    getWeb3Instance().then(async web3Config => {
      console.log('web3 information: ', web3Config)
      this.setState({ loadWeb3: true })
    }, async error => {
      console.log('getWeb3 error: ', error)
      this.setState({ loadWeb3 : false })
    })
  }

  onMenuClick = ( key ) => {
    this.setState({ nav: key })
    console.log(key)
  }

  getErrModal() {
    return <Modal
      title = 'ERROR'
      visible = {!this.state.loadWeb3}
      okButtonProps = {{disabled: true}}
      cancelButtonProps = {{disabled: true}}
    >
      <p>This is an unknown network. Please connect to Metadium network</p>
    </Modal>
  }

  getContent() {
    if (!this.state.loadWeb3) return;
    switch (this.state.nav){
      case '1': return <Authority title='Authority'/>
      case '2': return <Voting title='Voting'/>
      default:
    }
  }

  render() {
    return (
      <Layout className="layout">
        <Header style={{ padding: '0 15%', backgroundColor: 'white', borderBottom: 'inset' }}>
          <Row>
            <Col span={4}><img src='https://raw.githubusercontent.com/METADIUM/metadium-token-contract/master/misc/Metadium_Logo_Vertical_PNG.png' alt='' width='35%' height='35%' style={{float: 'left'}}/><h3>Governance</h3></Col>
            <Col offset={15} span={5}>
            <Tabs defaultActiveKey="1" onChange={this.onMenuClick}>
              <TabPane tab="Authority" key="1"></TabPane>
              <TabPane tab="Voting" key="2"></TabPane>
            </Tabs>
            </Col>
          </Row>
        </Header>

        <Content style={{ backgroundColor: 'white' }}>
        {this.state.loadWeb3
          ?<div> {this.getContent()} </div>
          :<div> { this.getErrModal()} </div>
        }
        </Content>
       
        <Footer style={{ textAlign: 'center'}}>
          Copyright © Since 2018 Metadium Technology, Inc. All rights reserved
        </Footer>
      </Layout>
    )
  }
}

export default App;
