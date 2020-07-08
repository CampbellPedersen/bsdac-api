import React from 'react';
import './loading-screen.css';

const loadingPhrases = [
  'Putting it in the raps',
  'Welcoming you to BSDAC 11',
  'Purchasing hand warmers',
  'Drinking peach iced tea 1.5L',
];

export const LoadingScreen = () => {
  const randomPhrase = () => loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

  return <div className='loading-screen'>
    <div className="spinner-border spinner-border-lg" role="status">
      <span className="sr-only">Loading...</span>
    </div>
    <h4 className='font-weight-light mt-3'>{randomPhrase()}...</h4>
  </div>;
};