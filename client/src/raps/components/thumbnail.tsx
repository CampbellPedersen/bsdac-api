import React from 'react';
import { Rap } from "../types";
import './thumbnail.scss'

export const Thumbnail: React.FC<{ rap?: Rap }> = ({ rap }) =>
  <div className={`thumbnail${rap ? '' : ' empty'}`}>
    {rap && <img alt='thumbnail' src={rap.imageUrl} />}
  </div>