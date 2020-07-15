import React from 'react';
import './loading-overlay.scss'
import { Spinner } from './spinner';

export const LoadingOverlay: React.FC<{ loading?: boolean }> =
({ loading, children }) => <>
  {children}
  { loading &&
    <div className='overlay'>
      <Spinner small />
    </div>
  }
</>