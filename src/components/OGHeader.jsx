import React from "react";
import { Helmet } from "react-helmet";

const metaData = {
  // wait: {
  //   title: "WAIT Protocol | 40 WONDERS",
  //   keywords:
  //     "WAIT Protocol, Investment, WEMIX 재단, 블록체인 생태계, WEMIX 투자, WAIT, 프로토콜",
  //   ogTitle: "40 WONDERS | WAIT Protocol",
  //   description:
  //     "The WAIT Protocol enables consistent investments in the ecosystem's growth while ensuring transparency and objectivity.",
  // },
  // governance: {
  //   title: "WAIT Governance | 40 WONDERS",
  //   keywords:
  //     "WAIT Protocol, Investment, Governance, Voting, 4, 거버넌스, 투표, 안건",
  //   ogTitle: "40 WONDERS | WAIT Governance",
  //   description:
  //     "Through the qualitative assessment of the investments for the WEMIX ecosystem's growth, the feasibility is validated, and the final approval of the proposal is decided upon the votes of the 40 WONDERS.",
  // },
  default: {
    title: "Metadium Governance",
    keywords:
      "wemix, wemix3.0, wemix 3.0, blockchain, ethereum, evm, cryptocurrency, digital asset, decentralization, public blockchain, wemix$, dapp, platform, web3, web3.0, on-chain, smart contract, 위믹스, 위믹스3.0, 위믹스 3.0, 블록체인, 이더리움, 암호화폐, 가상화폐, 디지털 자산, 탈중앙화, 퍼블릭 블록체인, 위믹스달러, 디앱, 플랫폼, 웹3, 웹3.0, 온체인, 스마트 컨트랙트, 스마트 계약, 40 wonders, 40 ncp, main net, wonders, wonder, wait, wait protocol, protocol, governance, node, voting, pmr, reward, partner, ncp, community, staking, consensus, validation, wonder dao, dao, 40 원더스, 원더스, 원더, 위믹스 노드, 프로토콜, 거버넌스, 노드, 투표, 리워드, 민팅 리워드, 파트너, 커뮤니티, 스테이킹, 합의, 검증, 원더다오, 다오",
    ogTitle: "40 Metadium Governance",
    description:
      "40 Node Council Partners will become the foundation of a new Web3 life built on WEMIX3.0 by contributing to the development and growth of the mega-ecosystem while providing impenetrable security on our new layer 1 mainnet.",
  },
};

const OGHeader = ({ url = "default" }) => (
  <Helmet>
    {/* TODO: process.env.PUBLIC_URL가 배포 URL이 맞는지 꼭 확인해주세요~! */}
    <title>{metaData[url].title}</title>
    <meta
      property="og:url"
      content={`${process.env.REACT_APP_URL}/${url}`}
      key="ogUrl"
    />
    <meta
      property="og:image"
      content={`${process.env.REACT_APP_URL}/img/OG_40WONDERS.png`}
    />
    <meta name="keywords" content={metaData[url].keywords} key="keywords" />
    <meta property="og:title" content={metaData[url].ogTitle} key="ogTitle" />
    <meta
      property="og:description"
      content={metaData[url].description}
      key="ogDescription"
    />
    <meta
      property="twitter:url"
      content={`${process.env.REACT_APP_URL}/${url}`}
      key="twitterUrl"
    />
    <meta
      property="twitter:image"
      content={`${process.env.REACT_APP_URL}/img/OG_40WONDERS.png`}
    />
    <meta
      property="twitter:title"
      content={metaData[url].ogTitle}
      key="twitterTitle"
    />
    <meta
      property="twitter:description"
      content={metaData[url].description}
      key="twitterDescription"
    />
  </Helmet>
);

export default OGHeader;
