import React from 'react';
import './loading-screen.scss';
import { Spinner } from './spinner';
import { randomElement } from '../utils/array';

const loadingPhrases = [
  'Putting it in the raps',
  'Purchasing hand warmers',
  'Placing speaker in the center',
  'Cracking open a beer',
  'First-picking armored bee',
  'Stealing RedFalco\'s name',
  'Weighing Dennis',
  'Four stocking Fish, Phang and Simon',
  'Debating semantics with Piers',
  'Getting snacks for Harry',
];

export const LoadingScreen = () =>
  <div className='loading-screen d-flex flex-column align-items-center justify-content-center'>
    <Spinner />
    <h4 className='font-weight-light mt-3'>{randomElement(loadingPhrases)}...</h4>
  </div>;