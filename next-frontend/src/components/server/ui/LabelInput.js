import React from 'react'

function LabelInput({type, name, title, placeholder}) {
  return (
    <>
        <label className=" text-xl mb-1">{title}</label>
      <input 
      autoComplete='false'
          className="text-exalt shadow-sm shadow-background_third mb-5 p-2 bg-transparent border-2 border-background_third focus:border-exalt transition-colors duration-300"
      
      type={type} 
      name={name} 
      placeholder={placeholder} 
      required />
      
    </>
  )
}

export default LabelInput