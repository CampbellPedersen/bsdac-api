import React from 'react';
import { Rap } from '../types';
import './list.scss';

export const RapList: React.FC<{ raps: Rap[] }> = ({ raps }) =>
  <ul className="rap-list list-group">
    {raps.map(rap =>
      <li key={rap.id} className="list-group-item container">
        <RapListItem rap={rap} />
      </li>
    )}
  </ul>;


const RapListItem: React.FC<{ rap: Rap }> = ({ rap }) => {
  const aboveText = `${rap.appearedAt.name} ${rap.appearedAt.series}${rap.bonus ? ' (Bonus)' : ''}`;
  return (
    <div className='row'>
      <div className="d-flex align-items-center col-3">
        <div className='thumbnail'><img alt='thumbnail' src={rap.imageUrl} /></div>
      </div>
      <div className='col-9'>
        <span className='font-weight-lighter text-muted'>{aboveText}</span>
        <h3 className='font-weight-light'>{rap.title}</h3>
        <small className='font-weight-lighter text-muted'>by {rap.rapper}</small>
      </div>
    </div>
  );
};

