import React from 'react';
import './player-button.scss'

export const PlayerButton: React.FC<{
  focus?: boolean
  onClick: () => void
}> = ({ focus, onClick, children }) =>
  <button className={`player-button ${focus ? 'focus' : ''}`} onClick={onClick}>
      {children}
  </button>