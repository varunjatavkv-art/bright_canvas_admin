import React from 'react'

const NoDataFound = ({text}) => {
  return (
   <div className="items-center h-100">
      <p className="text-gray-500 text-center">{text}</p>
    </div> 
  )
}

export default NoDataFound;