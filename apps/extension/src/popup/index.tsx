import React, { useState } from "react"

function Popup() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.tabs.sendMessage(tab.id!, { action: isActive ? "stop" : "init" })
    setIsActive(!isActive);
  }

  return <button onClick={handleClick}>{isActive ? "Detener" : "Iniciar"}</button>
}

export default Popup
