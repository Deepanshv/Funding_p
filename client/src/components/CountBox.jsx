import React from 'react'

const CountBox = ({ title, value }) => {
  return (   
    <div className="pro-card p-6 text-center space-y-2">
      <div className="text-2xl font-bold text-white">
        {value}
      </div>
      <p className="text-slate-400 text-sm uppercase tracking-wide">{title}</p>
    </div>
  )
}

export default CountBox