import React, { forwardRef } from 'react';

const Input = forwardRef(({ className = '', type = 'text', label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[13px] font-medium text-[#4A4D4E]">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`rounded-md border-[#56A8F0] border-[1px] h-[36px] px-3 w-full text-sm text-[#4A4D4E] focus:ring-1 focus:ring-[#56A8F0] focus:border-[#56A8F0] outline-none transition-shadow placeholder:text-gray-400 ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        } ${className}`}
        ref={ref}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
