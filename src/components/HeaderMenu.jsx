import { Menu } from "antd"
import cn from "classnames/bind"
import React, { useRef } from "react"
import { Link, useLocation } from "react-router-dom"
// TODO:  path는 상황에 맞게 넣어주세요. voting, myinfo 페이지에 layout 내용 넣을 때 props로 activate="menu-voting" or activate="menu-myinfo" 이런식으로 메뉴 키값에 맞게 넣어주세요.
const menuList = [
  {
    title: "Authority",
    path: "/",
    key: "menu-authority",
    onlyMember: false
  },
  {
    title: "Voting",
    path: "/voting/list",
    key: "menu-voting",
    onlyMember: false
  },
  {
    title: "My Info",
    path: "/my-info",
    key: "menu-myinfo",
    onlyMember: true
  }
]
const HeaderMenu = ({ isMember, isStaker, isConnect, setIsGnbOpen }) => {
  const activeMenu = useRef("menu-authority")
  const location = useLocation()

  const onMenuClick = (key) => {
    activeMenu.current = key
    // console.log(activeMenu.current);
    window.localStorage.removeItem("selectedTopic")
    setIsGnbOpen(false)
  }
  const menuComponent = menuList.map((menu) => {
    return menu.onlyMember ? (
      isConnect && isMember && isStaker && (
        <Menu.Item
          key={menu.title}
          className={
            // 일단 pathname에 voting 추가되어 있지 않으면
            !location.pathname.includes("voting")
              ? // path따라 active 클래스 추가
              location.pathname === menu.path && "active"
              : // voting이라면 menu.title이 Voting일때 active 클래스 추가
              menu.title === "Voting" && "active"
          }>
          <Link to={menu.path} onClick={() => onMenuClick(menu.key)}>
            {menu.title}
          </Link>
        </Menu.Item>
      )
    ) : (
      <Menu.Item
        key={menu.title}
        className={
          !location.pathname.includes("voting")
            ? location.pathname === menu.path && "active"
            : menu.title === "Voting" && "active"
        }>
        <Link to={menu.path} onClick={() => onMenuClick(menu.key)}>
          {menu.title}
        </Link>
      </Menu.Item>
    )
  })

  return (
    <Menu
      className={cn("header-gnb", isConnect && isMember && "connect")}
    >
      {menuComponent}
    </Menu>
  )
}

export default HeaderMenu
