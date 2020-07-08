import React from 'react';

interface ButtonProps {
  style: 'primary' | 'secondary' | 'danger'
  type: 'submit' | 'button'
  id: string
  text: string
  disabled?: boolean
  icon?: string
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({ style, type, id, text, icon, disabled, onClick}) => {
  const buttonClass = (style: 'primary' | 'secondary' | 'danger') => {
    switch(style) {
      case 'primary':
        return 'btn btn-primary';
      case 'secondary':
        return 'btn btn-secondary';
      case 'danger':
        return 'btn btn-danger';
    }
  };

  return (
    <button
      id={id}
      className={buttonClass(style)}
      type={type}
      disabled={disabled || false}
      onClick={() => { if (onClick) onClick(); }}>
      {icon && <img src={icon} alt=''></img>}
      {text}
    </button>
  );
};
