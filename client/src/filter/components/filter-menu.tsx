import React, { useContext } from 'react';
import { AppContext } from '../../context';
import { Card, CardHeader, CardBody } from '../../components/card';
import { CloseButton } from '../../components/close-button';
import { useFilters } from '../filters';
import { Checkbox } from '../../components/forms';
import { Event } from '../../raps/types';
import './filter-menu.scss';

export const FilterMenu: React.FC = () => {
  const {
    filter: { showMenu },
    actions: { filterMenuToggled }
  } = useContext(AppContext);
  const filters = useFilters();

  return <div className={`filter-menu ${ showMenu ? 'show' : '' }`}>
    <Card>
      <CloseButton onClick={filterMenuToggled} />
      <ul className='list-group list-group-flush'>
        <li className='list-group-item'>
          <h5>Events</h5>
          {filters.events.map(eventCheckbox)}
        </li>
        <li className='list-group-item'>
          <h5>Artists</h5>
          {filters.rappers.map(rapperCheckbox)}
        </li>
        <li className='list-group-item'>
          <h5>Bonus Tracks</h5>
          <Checkbox id='hide-bonus'
            label='Hide Bonus Tracks'
            onChange={checked => console.log(`Hide bonus tracks: ${checked}`)} />
        </li>
      </ul>
    </Card>
  </div>
}

const eventCheckbox = (event: Event) => {
  const label = `${event.name} ${event.series}`;
  return <Checkbox id={label}
    key={label}
    label={label}
    onChange={checked => console.log(`${label}: ${checked}`)} />
}

const rapperCheckbox = (rapper: string) =>
  <Checkbox id={rapper}
    key={rapper}
    label={rapper}
    onChange={checked => console.log(`${rapper}: ${checked}`)} />
