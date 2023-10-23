import React from "react";
import { Layout } from "antd";
import "./home.scss";
import MoreButton from "./components/voting/GovButton";

const { Content } = Layout;

const Home = () => {
  return (
    <Layout>
      <Content style={{ margin: "0 auto" }}>
        <div className="home_container">
          <div className="home_title_bg">
            <div className="home_title_wrapper">
              <div>metadium governance</div>
              <div>
                Metadium uses its advanced technology and experience to provide
                a new ecosystem of compliant services and solutions that serve
                as the bridge to blockchain’s true potential. Metadium
                Governance can receive various proposals to improve Metadium in
                a decentralized way, and network members can directly
                participate in decision-making. Enable active governance
                operations through an autonomous authority configuration to
                develop and grow the Metadium ecosystem.
              </div>
            </div>
            <div className="home_title_description_wrapper">
              <div className="home_title_description">
                <div>Staking</div>
                <div>
                  Metadium staking is one of the prerequisites to becoming an
                  authority member. The staking method is possible by sending
                  Metadium while calling a predefined function in the governance
                  contract known at the system level. Even if staking is
                  completed, it cannot become a member unless an official
                  contract with the Metadium Blockchain Foundation and identity
                  disclosure is made.
                </div>
              </div>
              <div className="home_title_description_img"></div>
            </div>
            <div className="home_title_description_wrapper">
              <div className="home_title_description">
                <div>Staking</div>
                <div>
                  Metadium staking is one of the prerequisites to becoming an
                  authority member. The staking method is possible by sending
                  Metadium while calling a predefined function in the governance
                  contract known at the system level. Even if staking is
                  completed, it cannot become a member unless an official
                  contract with the Metadium Blockchain Foundation and identity
                  disclosure is made.
                </div>
              </div>
              <div className="home_title_description_img"></div>
            </div>
          </div>

          <div className="home_partners_bg">
            <div className="home_partners_wrapper">
              <div className="home_partners_title">
                <div className="home_partners_title_description_area"></div>
                <div className="home_partners_title_btn_area"></div>
              </div>
              <div className="home_partners_list_wrapper">
                <div className="home_partners_list">
                  <div className="home_partners_item">
                    <div className="home_partners_item_title"></div>
                    <div className="home_partners_item_description"></div>
                  </div>
                  <div className="home_partners_item"></div>
                  <div className="home_partners_item"></div>
                  <div className="home_partners_item"></div>
                </div>
                <div className="home_partners_list">
                  <div className="home_partners_item"></div>
                  <div className="home_partners_item"></div>
                  <div className="home_partners_item"></div>
                  <div className="home_partners_item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
