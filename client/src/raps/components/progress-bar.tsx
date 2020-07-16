import React from 'react';

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) =>
<div className="progress">
  <div
    className="progress-bar progress-bar-striped progress-bar-animated"
    role="progressbar"
    aria-valuenow={progress}
    aria-valuemin={0}
    aria-valuemax={100}
    style={{ width: `${progress}%` }}/>
</div>