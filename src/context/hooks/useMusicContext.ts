import { useContext } from 'react';
import { MusicContext, MusicContextProps } from '../MusicContext';

export const useMusicContext = (): MusicContextProps => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

export default useMusicContext;