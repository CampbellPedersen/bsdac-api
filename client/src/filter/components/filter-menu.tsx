import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context';
import { Card, CardHeader } from '../../components/card';
import { CloseButton } from '../../components/close-button';
import { useFilters, useApplyFilters } from '../filters';
import { Checkbox } from '../../components/forms';
import { Event } from '../../api/raps/types';
import './filter-menu.scss';

interface FilterState {
  events: Event[],
  rappers: string[],
  hideBonus: boolean
}

export const FilterMenu: React.FC = () => {
  const {
    filter: { showMenu },
    actions: { filterMenuToggled }
  } = useContext(AppContext);

  const options = useFilters();
  const [filters, setFilters] = useState<FilterState>({ events: [], rappers: [], hideBonus: false });

  const apply = useApplyFilters();
  useEffect(() => apply(filters), [ apply, filters ])

  return <div className={`filter-menu ${ showMenu ? 'show' : '' }`}>
    <Card>
      <CardHeader>
        <CloseButton onClick={filterMenuToggled} />
        <strong>Filters</strong>
      </CardHeader>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item'>
          {options.events.map(event =>
            eventCheckbox(event, checked => {
              const temp = { ...filters };
              if (checked) temp.events.push(event);
              else temp.events = temp.events.filter(i => !eventsAreEqual(i, event));
              setFilters(temp);
            }))}
        </li>
        <li className='list-group-item'>
          {options.rappers.map(rapper => 
            rapperCheckbox(rapper, checked => {
              const temp = { ...filters };
              if (checked) temp.rappers.push(rapper);
              else temp.rappers = temp.rappers.filter(i => i !== rapper);
              setFilters(temp);
            }))}
        </li>
        <li className='list-group-item'>
          <Checkbox id='hide-bonus'
            label='Hide Bonus Tracks'
            onChange={hideBonus => setFilters({ ...filters, hideBonus })} />
        </li>
      </ul>
    </Card>
  </div>
}

const eventCheckbox = (event: Event, onChecked: (checked: boolean) => void) => {
  const label = `${event.name} ${event.series}`;
  return <Checkbox id={label}
    key={label}
    label={label}
    onChange={onChecked} />
}

const rapperCheckbox = (rapper: string, onChecked: (checked: boolean) => void) =>
  <Checkbox id={rapper}
    key={rapper}
    label={rapper}
    onChange={onChecked} />

const eventsAreEqual = (a: Event, b: Event) => a.name === b.name && a.series === b.series;