import React from 'react';

export const Card: React.FC<{ body?: boolean }> = ({ body, children }) =>
  <div className='card'>
    { body ? <CardBody>{children}</CardBody>: children}
  </div>

export const CardHeader: React.FC = ({ children }) =>
  <div className='card-header'>
    {children}
  </div>

export const CardBody: React.FC = ({ children }) =>
  <div className='card-body'>
    {children}
  </div>

export const CardTitle: React.FC = ({ children }) =>
  <h5 className="card-title">{children}</h5>