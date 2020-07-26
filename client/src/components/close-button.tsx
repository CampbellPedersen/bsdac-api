import React from 'react';

export const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) =>
  <button onClick={onClick} type="button" className="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>