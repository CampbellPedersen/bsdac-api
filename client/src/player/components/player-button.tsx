import React from 'react';
import './player-button.scss';

export const PlayerButton: React.FC<React.PropsWithChildren<{
  label?: string
  focus?: boolean
  onClick: () => void
}>> = ({ label, focus, onClick, children }) =>
  <button aria-label={label} className={`player-button ${focus ? 'focus' : ''}`} onClick={onClick}>
      {children}
  </button>;
