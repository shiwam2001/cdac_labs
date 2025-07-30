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
          className="absolute top-2 right-2  text-black text-xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>

    </div>
  )
}

export default modal
