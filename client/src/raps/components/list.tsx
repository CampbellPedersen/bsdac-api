import React from 'react';
import { Rap, getEventLabel } from '../../api/raps/types';
import './list.scss';
import { Thumbnail } from './thumbnail';
import { useSelectedRapScroll } from './use-selected-rap-scroll';

export const RapList: React.FC<{ raps: Rap[], selectedRapId?: string, onSelect: (rap: Rap) => void }> =
  ({ raps, selectedRapId, onSelect }) => {
    const selectedRef = useSelectedRapScroll(selectedRapId);

    if (!raps.length) return (
      <h2 className='text-center'>
        Oh my goodness! I forgot to make a rap, mun!
        <small><p>(No raps match your filters)</p></small>
      </h2>
    );

    return (
      <ul className="rap-list list-group">
        {raps.map(rap =>
          <li
            key={rap.id}
            ref={selectedRapId === rap.id ? selectedRef : undefined}
            onClick={() => onSelect(rap)}
            className={`list-group-item container clickable ${selectedRapId === rap.id ? 'selected' : ''}`}
          >
            <RapItem rap={rap} />
          </li>
        )}
      </ul>
    );
  };

const RapItem: React.FC<{rap: Rap}> =
  ({ rap }) => {
    const aboveText = `${getEventLabel(rap.appearedAt)}${rap.bonus ? ' (Bonus Track)' : ''}`;
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
