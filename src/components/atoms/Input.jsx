import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'right',
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const showFloatingLabel = focused || hasValue;

  const inputClasses = `w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
    error 
      ? 'border-red-300 focus:border-red-500' 
      : 'border-gray-200 focus:border-primary'
  } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} ${
    icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
  } ${type === 'password' ? 'pr-10' : ''}`;

  const labelClasses = `absolute left-4 transition-all duration-200 pointer-events-none ${
    showFloatingLabel 
      ? 'top-1 text-xs text-gray-500' 
      : 'top-1/2 transform -translate-y-1/2 text-gray-400'
  }`;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          className={inputClasses}
          placeholder={showFloatingLabel ? '' : placeholder}
          {...props}
        />
        
        {label && (
          <label className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {icon && (
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${
            iconPosition === 'left' ? 'left-3' : 'right-3'
          }`}>
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;