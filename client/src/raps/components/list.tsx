import React from 'react';
import { Rap } from '../types';
import './list.scss';
import { Thumbnail } from './thumbnail';

export const RapList: React.FC<{ raps: Rap[], onSelect: (rap: Rap) => void }> =
  ({ raps, onSelect }) =>
    <ul className="rap-list list-group">
      {raps.map(rap =>
        <li key={rap.id} onClick={() => onSelect(rap)} className="list-group-item container">
          <RapItem rap={rap} clickable />
        </li>
      )}
    </ul>;

const RapItem: React.FC<{rap: Rap, clickable?: boolean }> =
  ({ rap, clickable }) => {
    const aboveText = `${rap.appearedAt.name} ${rap.appearedAt.series}${rap.bonus ? ' (Bonus Track)' : ''}`;
    return <>
      <div className={`row${ clickable && ' clickable'}`}>
        <div className="col-3 px-0 px-sm-2">
          <Thumbnail rap={rap} />
        </div>
        <div className='col'>
          <span className='font-weight-lighter text-muted'>{aboveText}</span>
          <h5 className='font-weight-light'>{rap.title}</h5>
          <small className='font-weight-lighter text-muted'>by {rap.rapper}</small>
        </div>
      </div>
    </>;
  };