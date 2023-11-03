import { useState } from "react"

const useModal = () => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [errLink, setErrLink] = useState("")

  const getErrModal = (
    _err = "Unknown Error",
    _title = "Unknown Error",
    _link = false
  ) => {
    if (_err.includes("error:")) _err = _err.split("error:")[1]

    setTitle(_title)
    setContent(_err)
    if (_link) {
      setErrLink(
        `https://${
          process.env.REACT_APP_MODE === "production" ? "" : "testnet"
        }explorer.metadium.com/${_link}`
      )
    } else setErrLink(false)
    setIsModalOpened(true)
  }
  return {
    setIsModalOpened,
    getErrModal,
    isModalOpened,
    title,
    content,
    errLink
  }
}

export { useModal }
