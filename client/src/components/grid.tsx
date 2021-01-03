import React from 'react';

export const Row: React.FC = ({ children }) =>
  <div className='row'>{children}</div>

export const Column: React.FC<{
  xs?: number
  lg?: number
}> = ({ xs, lg, children }) =>
  <div className={`col${xs ? `-${xs}` : ''} ${lg ? `col-lg-${lg}` : ''}`}>{children}</div>