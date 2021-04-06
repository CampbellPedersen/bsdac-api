import React from 'react';

type ButtonStyle = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'lg';
type ButtonType = 'button' | 'submit';

interface Props {
  btn: ButtonStyle
  size: ButtonSize
  className?: string
  type?: ButtonType
  disabled?: boolean
}

export const Button: React.FC<Props> = ({
  btn,
  size,
  className,
  type,
  disabled,
  children
}) => {
  return (
    <button
      className={`btn ${styleClass(btn)} ${sizeClass(size)} ${className}`}
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