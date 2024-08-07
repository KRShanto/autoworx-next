import React from 'react'


interface PayoutCardProps {
    title: string;
    amount: string;
    percentage: string;
    customStyles?: string;
}

const  PayoutCard = ({title,amount,percentage,customStyles}: PayoutCardProps)=>{
    return (
        <div className={` sm: bg-white text-sm box-border  w-full h-full border border-gray-300 rounded-lg p-5 ${customStyles}`}>
          <div className="text-gray-500 font-inter font-bold text-xl mb-4 w-[300px]">{title}</div>
          <div className="text-gray-500 font-inter font-semibold text-6xl mb-4">{amount}</div>
          <div className="text-teal-500 font-inter font-semibold text-xl">{percentage}</div>
        </div>
      );
}

export default PayoutCard;