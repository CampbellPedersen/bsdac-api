import React from 'react';
import { Rap } from '../../api/raps/types';
import './list.scss';
import { Thumbnail } from './thumbnail';

export const RapList: React.FC<{ raps: Rap[], onSelect: (rap: Rap) => void }> =
  ({ raps, onSelect }) => {
    if (!raps.length) return (
      <h2 className='text-center'>
        Oh my goodness! I forgot to make a rap, mun!
        <small><p>(No raps match your filters)</p></small>
      </h2>
    );

    return (
      <ul className="rap-list list-group">
        {raps.map(rap =>
          <li key={rap.id} onClick={() => onSelect(rap)} className="list-group-item container clickable">
            <RapItem rap={rap} />
          </li>
        )}
      </ul>
    )
  };

const RapItem: React.FC<{rap: Rap}> =
  ({ rap }) => {
    const aboveText = `${rap.appearedAt.name} ${rap.appearedAt.series}${rap.bonus ? ' (Bonus Track)' : ''}`;
    return <>
      <div className='row'>
        <div className="col-3 px-0 px-sm-2 d-flex align-items-center">
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