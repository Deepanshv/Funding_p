import React from 'react'

const CountBox = ({ title, value }) => {
  return (   
    <div className="flex flex-col items-center w-[150px]">
      <h4 className="font-epilogue font-bold text-[30px] text-white p-3  bg-gradient-to-r from-pink-500 to-rose-500 backdrop-filter backdrop-blur-lg rounded-t-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[16px] bg-[#ffffff] px-3 py-2 w-full rouned-b-[10px]  text-center">{title}</p>
    </div>
  )
}

export default CountBox