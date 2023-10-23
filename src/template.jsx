import React from 'react'
import Layout from './components/Layout.jsx'

const Template = () => {
  return (
    // activate 값은 header > menulist > key 값과 동일하게 넣어주세요. (menu-voting, menu-myinfo)
    // 지금처럼 넣으면 voting 메뉴에 active가 됩니다.
    <Layout activate="menu-voting">{/* 페이지 콘텐츠는 이 안에 넣어주세요 */}</Layout>
  )
}

export default Template
