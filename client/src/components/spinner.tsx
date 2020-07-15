import React from 'react';

export const Spinner: React.FC<{small?: boolean}> = ({ small }) => {
  const spinnerClasses = ['spinner-border'];
  if(small) spinnerClasses.push('spinner-border-sm');
  return (
    <span className={spinnerClasses.join(' ')} role="status" aria-hidden="true">
      <span className='sr-only'>Loading...</span>
    </span>
  );
}