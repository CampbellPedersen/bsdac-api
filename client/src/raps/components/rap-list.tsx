import React from 'react';
import { Rap } from '../types';
import './rap-list.css';

export const RapList: React.FC<{ raps: Rap[] }> = ({ raps }) =>
  <ul className="rap-list list-group">
    {raps.map(rap =>
      <li key={rap.id} className="list-group-item container">
        <RapListItem rap={rap} />
      </li>
    )}
  </ul>;


const RapListItem: React.FC<{ rap: Rap }> = ({ rap }) =>
  <div className='row'>
    <div className="col-3">
      <div className='thumbnail'><img alt='thumbnail' src={rap.imageUrl} /></div>
    </div>
    <div className='col-9'>
    <small className='text-muted'>{rap.appearedAt.name} {rap.appearedAt.series}{rap.bonus && ' (Bonus)'}</small>
      <h4 className='font-weight-normal'>{rap.title}</h4>
    </div>
  </div>;
