import React from 'react';
import './player-button.scss'

export const PlayerButton: React.FC<{
  onClick: () => void
}> = ({ onClick, children }) =>
  <button className='player-button' onClick={onClick}>
      {children}
  </button>