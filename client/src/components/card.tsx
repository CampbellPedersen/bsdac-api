import React from 'react';

export const Card: React.FC<React.PropsWithChildren<{ body?: boolean }>> = ({ body, children }) =>
  <div className='card'>
    { body ? <CardBody>{children}</CardBody>: children}
  </div>;

export const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) =>
  <div className='card-header'>
    {children}
  </div>;

export const CardBody: React.FC<React.PropsWithChildren> = ({ children }) =>
  <div className='card-body'>
    {children}
  </div>;

export const CardTitle: React.FC<React.PropsWithChildren> = ({ children }) =>
  <h5 className="card-title">{children}</h5>;
