import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import "../style/style.css";
import VotingInputArea from "./VotingInputArea";
import VotingSelect from "./VotingSelect";
import Button from "./Button";

const VotingTextfield = () => {
  const [inputValueAddress, setValueAddress] = useState("default value");
  const [inputValueName, setValueName] = useState("default value");
  const [inputValueLocked, setValueLocked] = useState("");
  const [inputValueNode, setValueNode] = useState("");
  const [inputValueDescription, setValueDescription] = useState("");
  const [inputValueDescription2, setValueDescription2] = useState("");
  const [inputValueDescription3, setValueDescription3] = useState("");
  const [inputValueStaking, setValueStaking] = useState("");
  const [inputValueStaking2, setValueStaking2] = useState("");
  const [inputValueMultiBlock1, setInputValueMultiBlock1] = useState("");
  const [inputValueMultiBlock2, setInputValueMultiBlock2] = useState("");
  const [inputValueMultiBlock3, setInputValueMultiBlock3] = useState("");
  const [inputValueMultiBlock4, setInputValueMultiBlock4] = useState("");
  const [inputValueMultiBlock5, setInputValueMultiBlock5] = useState("0");
  const [inputValueMultiBlock6, setInputValueMultiBlock6] = useState("");
  const filterData = ["2days", "3days", "4days", "5days"];
  return (
    <>
      <div className={cn("textfield-contain")}>
        <div className={cn("textfield-wrap")}>
          <div className={cn("voting-input-wrap")}>
            <strong>
              New Authority Address
              <span className={cn("important")}>*</span>
            </strong>
            <VotingInputArea
              title={"New Authority Address"}
              inputType={"default"}
              placeholder={"Enter Address"}
              value={inputValueAddress}
              onChange={setValueAddress}
            />
            {/* 23.03.06 수정: VotingInputArea 컴포넌트 내부에 있던 description을 컴포넌트 밖으로 이동 */}
            <div className={cn("description")}>
              When registering the first Authority Address, the Stking Address,
              Voting Address, and Reward Address are the same.
            </div>
          </div>
          <div className={cn("voting-input-wrap")}>
            <strong>
              Node Name
              <span className={cn("important")}>*</span>
            </strong>
            <VotingInputArea
              disabled={true}
              inputType={"default"}
              placeholder={"Enter node name"}
              value={inputValueName}
              onChange={setValueName}
            />
          </div>
          <div className={cn("voting-input-wrap")}>
            <strong>
              WEMIX Amount to be locked
              <span className={cn("important")}>*</span>
            </strong>
            <VotingInputArea
              inputType={"prefix"}
              /* 23.03.06 수정: fixText pros 추가 (prefix 시 고정되는 텍스트) */
              fixText={"Prefix"}
              placeholder={"input text"}
              value={inputValueLocked}
              onChange={setValueLocked}
              type={"error"}
            />
          </div>
          <div className={cn("voting-input-wrap")}>
            <strong>
              New Authority Node Description
              <span className={cn("important")}>*</span>
            </strong>
            <VotingInputArea
              type={"default"}
              inputType={"default"}
              placeholder={"Enter Address"}
              value={inputValueNode}
              onChange={setValueNode}
            />
            {/* 23.03.06 수정: VotingInputArea 컴포넌트 내부에 있던 description을 컴포넌트 밖으로 이동 */}
            <div className={cn("description")}>
              The hexadecimal node ID is encoded in the username portion of the
              URL, separated from the host by an @ sign. The hostname can only
              be given as an IP address, DNS domain names are not allowed. The
              port in the host name section is the TCP listening port.
            </div>
          </div>
          <div className={cn("voting-input-wrap")}>
            <strong>Description</strong>
            <VotingInputArea
              inputType={"prefix"}
              /* 23.03.06 수정: fixText pros 추가 (prefix 시 고정되는 텍스트) */
              fixText={"Prefix"}
              placeholder={"Enter desc. max 256"}
              value={inputValueDescription}
              onChange={setValueDescription}
              type={"default"}
              disabled={true}
            />
          </div>
          <div className={cn("voting-input-wrap")}>
            <strong>Description</strong>
            <VotingInputArea
              inputType={"suffix"}
              /* 23.03.06 수정: fixText pros 추가 (Suffix 시 고정되는 텍스트) */
              fixText={"Suffix"}
              placeholder={"input text"}
              value={inputValueDescription2}
              onChange={setValueDescription2}
              type={"error"}
            />
          </div>
          <div className={cn("voting-input-wrap")}>
            <strong>
              Staking Amount
              <span className={cn("important")}>*</span>
            </strong>
            <div className={cn("double-input-box")}>
              <VotingInputArea
                inputType={"default"}
                placeholder={"Enter minimum amount"}
                value={inputValueStaking}
                onChange={setValueStaking}
              />
              {/* 23.03.06 수정: hyphen 마크업 변경 */}
              <span className={cn("hyphen")}>-</span>
              <VotingInputArea
                inputType={"default"}
                placeholder={"Enter maximum amount"}
                value={inputValueStaking2}
                onChange={setValueStaking2}
              />
            </div>
            {/* 23.03.06 수정: VotingInputArea 컴포넌트 내부에 있던 description을 컴포넌트 밖으로 이동 */}
            <div className={cn("description")}>
              The maximum amount of staking that can be set is 4,980,000 WEMIX
            </div>
          </div>
          {/* 23.03.06 수정 start: 케이스 추가 */}
          {/* title을 포함한 input 여러개 일때 */}
          <div className={cn("voting-input-wrap")}>
            <strong>
              Distribution Rate
              <span className={cn("important")}>*</span>
            </strong>
            <div
              className={cn("multi-input-box")}
              // !! input 갯수, 하이픈 갯수 css 변수로 추가 필요
              style={{ "--input-count": 5, "--hyphen-count": 4 }}
            >
              <div className={cn("input-cell")}>
                <strong className={cn("input-cell-title")}>
                  Block Producer
                </strong>
                <VotingInputArea
                  inputType={"suffix"}
                  fixText={"%"}
                  placeholder={"0 %"}
                  value={inputValueMultiBlock1}
                  onChange={setInputValueMultiBlock1}
                />
              </div>
              <span className={cn("hyphen")}>+</span>
              <div className={cn("input-cell")}>
                <strong className={cn("input-cell-title")}>
                  Staking Reward
                </strong>
                <VotingInputArea
                  inputType={"suffix"}
                  fixText={"%"}
                  placeholder={"0 %"}
                  value={inputValueMultiBlock2}
                  onChange={setInputValueMultiBlock2}
                />
              </div>
              <span className={cn("hyphen")}>+</span>
              <div className={cn("input-cell")}>
                <strong className={cn("input-cell-title")}>Ecosystem</strong>
                <VotingInputArea
                  inputType={"suffix"}
                  fixText={"%"}
                  placeholder={"0 %"}
                  value={inputValueMultiBlock3}
                  onChange={setInputValueMultiBlock3}
                />
              </div>
              <span className={cn("hyphen")}>+</span>
              <div className={cn("input-cell")}>
                <strong className={cn("input-cell-title")}>Maintenance</strong>
                <VotingInputArea
                  inputType={"suffix"}
                  fixText={"%"}
                  placeholder={"0 %"}
                  value={inputValueMultiBlock4}
                  onChange={setInputValueMultiBlock4}
                />
              </div>
              <span className={cn("hyphen")}>=</span>
              <div className={cn("input-cell")}>
                <strong className={cn("input-cell-title")}>Sum</strong>
                <VotingInputArea
                  inputType={"suffix"}
                  fixText={"%"}
                  placeholder={"0 %"}
                  value={inputValueMultiBlock5}
                  onChange={setInputValueMultiBlock5}
                  disabled={true}
                />
              </div>
            </div>
            <span className={cn("description")}>
              The maximum amount of staking that can be set is 4,980,000 WEMIX
            </span>
          </div>
          {/* 버튼형 input type */}
          <div className={cn("voting-input-wrap")}>
            <strong>
              Address to be removed
              <span className={cn("important")}>*</span>
            </strong>
            <div className={cn("button-input-box")}>
              <VotingInputArea
                inputType={"default"}
                placeholder={"Enter Staking Address"}
                value={inputValueMultiBlock6}
                onChange={setInputValueMultiBlock6}
              />
              <button className={cn("input-button")}>Check Balance</button>
            </div>
          </div>
          {/* 23.03.06 수정 end: 케이스 추가 */}
          <div className={cn("voting-input-wrap")}>
            <strong>Description</strong>
            <VotingInputArea
              disabled={false}
              inputType={"multiline"}
              placeholder={"Enter desc"}
              value={inputValueDescription3}
              onChange={setValueDescription3}
              type={"default"}
            />
          </div>
          <div className={cn("voting-duration")}>
            <div className={cn("voting-duration-wrap")}>
              <strong>
                Voting Duration <span className={cn("important")}>*</span>
              </strong>
              <VotingSelect
                filterData={filterData}
                className="voting-duration-select"
              />
            </div>

            <Button type="bg" disabled text={"Submit"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingTextfield;
