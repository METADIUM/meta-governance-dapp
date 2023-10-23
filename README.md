# METADIUM Governance dApp

## 2023.08.30

- yarn.lock & node_modules를 삭제하고 yarn install package.json의 dependency를 재설치하면 의존성 문제(process is not defined)가 발생하여, 기존의 yarn.lock을 origin-yarn.lock으로 생성하여 Push했습니다.

- Uncaught (in promise) TypeError: Cannot convert undefined or null to object 에러가 발생합니다. wagmi의 의존성인 @walletconnect/time에서 watch.js 에서 이슈가 발생하고 있습니다.

## 2023.07.06

wagmi의 sendTransactionAsync 요청 시에 value가 없으면 Wemix wallet에서 UI가 나타나지 않습니다.

## 2023.06.27

WalletConnect 적용을 위해 Node version 14 > 16 변경 및 react-scripts@^3.4.4 버전으로 업그레이드 했습니다.

react-scripts@^4.0.0 부터는 Babel 관련 Transcompile에서 문제가 발생합니다.

## Preview

```bash
$ yarn install
$ yarn start:devnet
```

## Deploy

```bash
# testnet
$ npm run-script build:testnet

$ npm install -g serve
$ serve -l 3005 -s build
```

## What more

- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [react-app-rewired](https://github.com/timarney/react-app-rewired)
- [antd](http://github.com/ant-design/ant-design/)
