import React from 'react'
import headerIcon from "@/assets/images/mainLogo.png";

const LoginLogoHeader = () => {
  return (
      <div className="flex justify-center pt-6">
          <img
            src={headerIcon}
            alt="Logo"
            className="h-20 w-20" // adjust size
          />
        </div>
  )
}

export default LoginLogoHeader