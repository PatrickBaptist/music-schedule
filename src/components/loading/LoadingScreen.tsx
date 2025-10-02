import React from 'react';
import { LoadingText, LoadingOverlay, Dot } from './LoadingScreenStyle';

const LoadingScreen: React.FC = () => {
  return (
    <LoadingOverlay>
      <LoadingText>
        Carregando
        <Dot style={{ animationDelay: '0s' }}>.</Dot>
        <Dot style={{ animationDelay: '0.2s' }}>.</Dot>
        <Dot style={{ animationDelay: '0.4s' }}>.</Dot>
      </LoadingText>
    </LoadingOverlay>
  )
}

export default LoadingScreen;