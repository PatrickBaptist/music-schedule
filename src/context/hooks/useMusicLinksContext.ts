import { useContext } from 'react';
import { MusicLinksContext, MusicLinksContextProps } from '../MusicLinksContext';

export const useMusicLinksContext = (): MusicLinksContextProps => {
  const context = useContext(MusicLinksContext);
  if (!context) {
    throw new Error('useMusicLinksContext must be used within a MusicLinksProvider');
  }
  return context;
};

export default useMusicLinksContext;