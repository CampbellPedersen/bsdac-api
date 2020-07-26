import React from 'react';

export const Card: React.FC<{ body?: boolean }> = ({ body, children }) =>
  <div className='card'>
    { body ? <CardBody>{children}</CardBody>: {children}}
  </div>

export const CardBody: React.FC = ({ children }) =>
  <div className='body'>
    {children}
  </div>