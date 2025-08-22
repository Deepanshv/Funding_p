import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles, disabled = false }) => {
  return (
    <button
      type={btnType}
      onClick={handleClick}
      disabled={disabled}
      className={`pro-button font-medium ${styles} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {title}
    </button>
  )
}

export default CustomButton