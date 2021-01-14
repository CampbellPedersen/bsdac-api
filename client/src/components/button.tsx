import React from 'react';

type ButtonStyle = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'lg';
type ButtonType = 'button' | 'submit';

export const Button: React.FC<{
  style: ButtonStyle
  size: ButtonSize
  className?: string
  type?: ButtonType
  disabled?: boolean
}> = ({style, size, className, type, disabled, children}) => {
  return (
    <button
      className={`btn ${styleClass(style)} ${sizeClass(size)} ${className}`}
      type={type ?? 'button'}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

const styleClass = (style: ButtonStyle): string => {
  switch(style) {
    case 'primary':
      return 'btn-primary';
    case 'secondary':
      return 'btn-secondary';
  }
}

const sizeClass = (size: ButtonSize): string => {
  switch(size) {
    case 'sm':
      return 'btn-sm';
    case 'lg':
      return 'btn-lg';
  }
}