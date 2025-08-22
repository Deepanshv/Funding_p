import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange, error, ...props }) => {
  return (
    <div className="space-y-2">
      {labelName && (
        <label className="block text-sm font-medium text-white">
          {labelName}
        </label>
      )}
      
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={6}
          placeholder={placeholder}
          className={`pro-input w-full px-4 py-3 text-sm resize-none ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
          {...props}
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          placeholder={placeholder}
          className={`pro-input w-full px-4 py-3 text-sm ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}

export default FormField