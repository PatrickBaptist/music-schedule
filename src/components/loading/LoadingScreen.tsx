import React from 'react';
import Loading from '../../assets/Loading.gif'
import { LoadingOverlay } from './LoadingScreenStyle';

const LoadingScreen: React.FC = () => {
  return (
    <LoadingOverlay>
      <img src={Loading} alt="Loading" />
    </LoadingOverlay>
  )
}

export default LoadingScreen;