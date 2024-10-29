import React from 'react';
import Loading from '../assets/Loading.gif'
import { LoadingScreenStyle } from './styles/LoadingScreen'

const LoadingScreen: React.FC = () => {
  return (
    <LoadingScreenStyle>
      <img src={Loading} alt="Loading" />
    </LoadingScreenStyle>
  )
}

export default LoadingScreen;