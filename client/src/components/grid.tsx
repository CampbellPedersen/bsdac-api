import React from 'react';

export const Row: React.FC = ({ children }) =>
  <div className='row'>{children}</div>

export const Column: React.FC = ({ children }) =>
  <div className='col'>{children}</div>