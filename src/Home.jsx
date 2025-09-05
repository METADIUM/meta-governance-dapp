import { Layout } from "antd";
import React, { useEffect, useRef, useState } from "react";

// partners logo

import StakingImage from "./assets/images/staking-illust.png";
import VotingImage from "./assets/images/voting-illust.png";
import GovButton from "./components/voting/GovButton";
import AuthorityList from "./static/AuthorityList.js";

let partners = AuthorityList[process.env.REACT_APP_MODE];

const veiwingCount = 10;

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMore, setShowMore] = useState(partners);

  const visibleItem = useRef(veiwingCount);

  const checkMobile = () => {
    if (window.innerWidth < 840) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const mobileShowInfo = (e) => {
    if (isMobile) {
      // 모바일일 때만
      e.stopPropagation();
      const el = e.currentTarget;
      el.classList.toggle("active");
    }
  };

  const openApplyForm = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930"
    );
  };

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
              <img src={StakingImage} alt="staking illust" />
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
              <img src={VotingImage} alt="voting illust" />
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
                <strong>Total Partners {partners.length}</strong>
              </div>
              <button className="default-btn" onClick={openApplyForm}>
                + Apply for Authority
              </button>
            </div>
          </div>
          {/* list */}
          <div className="partners-list">
            {partners.slice(0, visibleItem.current).map((item, index) => (
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
                  <li>Address: {item.reward}</li>
                  <li>
                    <span className="desc">{item.desc}</span>
                    <span className="cover-bar" />
                  </li>
                </ul>
              </div>
            ))}
          </div>
          {/* more 버튼 */}
          {partners.length > visibleItem.current && (
            <GovButton
              text={"More"}
              type={"more-btn"}
              onClick={() => {
                visibleItem.current += veiwingCount;
                setShowMore(partners.slice(0, visibleItem.current));
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
