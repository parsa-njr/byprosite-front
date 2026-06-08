import React from 'react'

const ErrorPage = () => {
    throw new Error("Test error!");
  return (
    <div>ErrorPage</div>
  )
}

export default ErrorPage