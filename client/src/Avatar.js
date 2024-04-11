import React from 'react'

export default function Avatar({userId,username,online}) {
    const colors = ['bg-blue-100','bg-green-200','bg-yellow-200','bg-purple-200','bg-red-200',]
   const userIdbase10 = parseInt(userId,16)
   const color =  colors[userIdbase10% colors.length]
  
    return (
    <div className={"w-9 h-9 bg-blue-100 rounded-full  flex items-center relative " }>
        <div className ='w-full text-center  opacity-70'>{username[0]}</div>
        {online && (
           <div className = " absolute h-3 w-3 bg-green-300 border border-white bottom-0 right-0 rounded-full "/>
        )}
        {!online && (
          <div className = " absolute h-3 w-3 bg-gray-300 border border-white bottom-0 right-0 rounded-full "/>
        )}
        
    </div>
  )
}
