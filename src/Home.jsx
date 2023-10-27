import React, { useEffect, useState } from "react";
import { Layout } from "antd";
// partners logo
import MetadiumLogo from "./assets/images/partners/ic-metadium-logo.svg";
import CplabsLogo from "./assets/images/partners/ic-cplabs-logo.svg";
import OntolgyLogo from "./assets/images/partners/ic-ontology-logo.png"
import MblockLogo from "./assets/images/partners/ic-mblock-logo.svg";
import PlaydappLogo from "./assets/images/partners/ic-playdapp-logo.svg";
import BifrostLogo from "./assets/images/partners/ic-bifrost-logo.svg";
import VistalabsLogo from "./assets/images/partners/ic-vistalabs-logo.svg";
import FbgLogo from "./assets/images/partners/ic-fbg-logo.svg";
import RockxLogo from "./assets/images/partners/ic-rockx-logo.svg";

import { ReactComponent as TempImage } from "./assets/images/temp_image.svg";

import GovButton from "./components/voting/GovButton";

let partners = [
  {
    logo: MetadiumLogo,
    company: "Metadium Technology, Inc.",
    link: "https://metadium.com/",
    address: "0x880a74d68b09418136c4442D1eA0f5cC72E5325A",
    desc: "Metadium is an ecosystem built on a public identity blockchain designed to create a decentralized identity ecosystem with the real world introduction of Self-Sovereign Identity; the concept that individuals are owners of all aspects of their own identity in the offline and online world. Our vision is to create a free world through self-sovereign identity.",
  },
  {
    logo: CplabsLogo,
    company: "CPLABS",
    link: "https://cplabs.io/",
    address: "0x14779F51c772035412B11488FE38de5d31815247",
    desc: "CPLABS is a leading South Korean blockchain development company. Since its founding in 2013, CPLABS has been providing next generation blockchain-based services and solutions to multiple industries, bringing innovation to people’s daily life. CPLABS is leading Korea’s blockchain industry with the biggest amount of blockchain",
  },
  {
    logo: OntolgyLogo,
    company: "Ontology",
    link: "https://ont.io/",
    address: "0xd8f5272EF21a50c5adB0fCEf31eb9E91aC4eB2f5",
    desc: "Ontology is a project that provides trust, privacy, and security to Web3 through a distributed identity (DID) and data solution. Ontology builds an infrastructure that provides trusted access to the Web3, enabling individuals and businesses to have the confidence that users and their privacy come first with compliant digital identity solutions. In the future, Metadium and Ontology plan to collaborate with global DID councils such as W3C and DIF, jointly develop systems, develop DID framework that enables VCs interchangeable, and design DID standards for Korean/Chinese government projects through Mykeepin Alliance.",
  },
  {
    logo: MblockLogo,
    company: "MBlock Inc.",
    link: "https://m-block.io/",
    address: "0xE7080384C22aA9B232993e2011b8c16585570524",
    desc: "Mblock is a blockchain, virtual asset, and NFT subsidiary company established by MAEKYUNG MEDIA GROUP. Mblock runs a validator business that supports operation of various blockchain networks such as Klaytn, Medibloc, and Metadium. And provides staking services for virtual assets. Mblock mints and builds various NFT projects, including World Knowledge Forum and Seoul Money Show. In addition, Mblock provides blockchain, virtual assets, NFT related content services such as newsletters.",
  },
  {
    logo: PlaydappLogo,
    company: "PlayDapp",
    link: "https://playdapp.io/",
    address: "0xA4A3a5B308D2319aF64deF1568cc80a82f40ea86",
    desc: "PlayDapp builds a peer-to-peer (C2C) marketplace based on Ethereum and Polygon networks and provides interoperability between games and a diverse game portfolio that gamers can enjoy with Non-Fungible Tokens (NFTs). PlayDapp focuses on services such as Metaverse and Play-to-Earn so that game developers and distributors, as well as gamers, can engage in digital economy activities through game contents incorporating blockchain technology. It also aims to become the world's best blockchain game service platform. Through a partnership with Metadium, it is planning to provide customized blockchain services by utilizing the user pools owned by both companies. In addition, by actively participating in the operation of the Metadium node, the strategic cooperation system will be strengthened.",
  },
  {
    logo: BifrostLogo,
    company: "Bifrost",
    link: "https://thebifrost.io/",
    address: "0x6ce8328a6460D6Fe4c17fdbBF6fAA88120dD65B8",
    desc: "Bifrost is a middleware solution that provides an ecosystem for the simultaneous use of multiple blockchain protocols. BiFi is the first app to showcase the potential of Bifrost. It started the world's first native BTC lending service, and is currently providing services by linking Bitcoin, Ethereum, Binance Chain and Avalanche networks. Bifrost expects to create synergy and expand the ecosystem through Metadium's node operation.",
  },
  {
    logo: VistalabsLogo,
    company: "VistaLabs Inc.",
    link: "https://www.vistalabs.info/",
    address: "0xfb0A7D2536B9e42B627315c5BB938F1a6524f4E3",
    desc: "VistaLabs is a crypto investment firm headquartered in Korea with 30+ portfolio projects globally. Established in 2021, the company has been investing in prominent blockchain projects in various sectors such as DeFi, P2E games, Metaverse, etc. The company is rapidly expanding its investments by leveraging the expertise from the crypto industry and traditional financial market.",
  },
  {
    logo: FbgLogo,
    company: "FBG Capital",
    link: "https://www.fbg.capital/",
    address: "0x2Dc152f7c9CacDfFBfEfe5774Af1fDf14DF0C6F6",
    desc: "Founded in 2017, FBG Capital is an investment company dedicated to blockchain technology, and is a representative digital asset finance group that provides wealth management solutions using industry-leading expertise in research, product design, transaction execution, and risk management. FBG Capital will contribute to the establishment of Metadium's global partnership ecosystem.",
  },
  {
    logo: RockxLogo,
    company: "RockX",
    link: "https://www.rockx.com/",
    address: "0xa996EEFfe2d9d3CFFdCe5B7FC51C357DA7aBeA6D",
    desc: "RockX is a leader in blockchain staking, leading the public blockchain. With a strong technical background and community driven operation, RockX provides secure validators to offer staking rewards for their cryptocurrency holders. RockX plans to build a Metadium staking pool in the future.",
  },
];

const Home = () => {

  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? partners : partners.slice(0, 10);

  const handleShow = () => {
    setShowAll(true);
  }

  const checkMobile = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true)
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    }
  }, [])
  
  const mobileShowInfo = (e) => {
    if (isMobile) {
      // 모바일일 때만
      e.stopPropagation();
      const el = e.currentTarget;
      el.classList.toggle("active");
    }
  }

  return (
    <Layout>
      <div className="section-head">
        <div className="wrap">
          <div className="title">
            <span>metadium governance</span>
            <p>
              Metadium uses its advanced technology and experience to provide a
              new ecosystem of compliant services and solutions that serve as
              the bridge to blockchain’s true potential. Metadium Governance can
              receive various proposals to improve Metadium in a decentralized
              way, and network members can directly participate in
              decision-making. Enable active governance operations through an
              autonomous authority configuration to develop and grow the
              Metadium ecosystem.
            </p>
          </div>
          <ul>
            <li>
              <div>
                <span className="subject">Staking</span>
                <p>
                  Metadium staking is one of the prerequisites to becoming an
                  authority member. The staking method is possible by sending
                  Metadium while calling a predefined function in the governance
                  contract known at the system level. Even if staking is
                  completed, it cannot become a member unless an official
                  contract with the Metadium Blockchain Foundation and identity
                  disclosure is made.
                </p>
              </div>
              {/* img 임시 처리 */}
              <TempImage />
            </li>
            <li>
              <div>
                <span className="subject">Voting</span>
                <p>
                  Each voting will be passed when more than 50% of the total
                  amount of staked Metadium is obtained during the voting
                  duration (1-7 days). Only one voting is conducted at a time,
                  so if there is existing voting in progress, it is impossible
                  to start new voting.
                </p>
              </div>
              {/* img 임시 처리 */}
              <TempImage />
            </li>
          </ul>
        </div>
      </div>
      <div className="section-body">
        <div className="wrap">
          <div className="title">
            <span className="subject">Partners</span>
            <div>
              <div>
                <p>
                  Partners in various fields and industries, collaborating with
                  Metadium to bring about change to your on-chain experience.
                </p>
                {/* 파트너사 9개 고정이라고 함 */}
                <strong>Total Partners 9</strong>
              </div>
              <button className="default-btn">+ Apply for Authority</button>
            </div>
          </div>
          {/* list */}
          <div className="partners-list">
            {visibleItems.map((item, index) => (
              <div key={index} onClick={mobileShowInfo}>
                <ul>
                  <li>
                    <img src={item.logo} alt={item.company} />
                  </li>
                  <li>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.company}
                    </a>
                  </li>
                  <li>Address: {item.address}</li>
                  <li>
                    <span className="desc">{item.desc}</span>
                    <span className="cover-bar"></span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          {/* more 버튼 */}
          {partners.length > 10 && !showAll && (
            <GovButton
              text={"More"}
              type={"more-btn"}
              onClick={handleShow}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
