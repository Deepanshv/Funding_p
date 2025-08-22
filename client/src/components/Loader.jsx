import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-8 flex flex-col items-center space-y-4">
        <div className="spinner w-8 h-8"></div>
        <p className="text-white font-medium">Processing transaction...</p>
        <p className="text-slate-400 text-sm text-center">Please wait while we process your request</p>
      </div>
    </div>
  )
}

export default Loader