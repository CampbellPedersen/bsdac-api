import React from 'react';
import './loading-screen.scss';
import { Spinner } from './spinner';

const loadingPhrases = [
  'Putting it in the raps',
  'Purchasing hand warmers',
  'Placing speaker in the center',
  'Cracking open a beer',
  'First-picking armored bee',
  'Stealing RedFalco\'s name',
  'Checking Dennis\' weight',
  'Four stocking Fish, Phang and Simon',
  'Debating semantics with Piers',
  'Getting snacks for Harry',
  'Having sex with the women',
];
const randomPhrase = () => loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

export const LoadingScreen = () =>
  <div className='loading-screen d-flex flex-column align-items-center justify-content-center'>
    <Spinner />
    <h4 className='font-weight-light mt-3'>{randomPhrase()}...</h4>
  </div>;