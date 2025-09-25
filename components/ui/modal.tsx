import React from 'react'

type ModalProps ={
    isOpen:boolean;
    onClose: ()=>void;
    children: React.ReactNode;
}

const modal = ({isOpen,onClose,children}:ModalProps) => {
    if(!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center    bg-opacity-50">
      <div className="bg-gray-100 p-6 rounded-xl  w-[140%] max-h-[50%] overflow-auto  max-w-md shadow-lg pb-14 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-black text-2xl hover:text-white hover:bg-red-400 w-8 h-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300 font-bold  rounded-full flex items-center justify-center shadow-md transition-all duration-300 "
        >
          &times;
        </button>
        {children}
      </div>

    </div>
  )
}

export default modal
