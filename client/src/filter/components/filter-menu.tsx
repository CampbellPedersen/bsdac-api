import React, { useContext } from 'react';
import { AppContext } from '../../context';
import { Card } from '../../components/card';
import { CloseButton } from '../../components/close-button';
import './filter-menu.scss';

export const FilterMenu: React.FC = () => {
  const {
    filter: { showMenu },
    actions: { filterMenuToggled }
  } = useContext(AppContext);

  return <div onClick={() => { console.log('test'); }} className={`filter-menu ${ showMenu ? 'show' : '' }`}>
    <Card body>
      <CloseButton onClick={filterMenuToggled} />
      
    </Card>
  </div>
}