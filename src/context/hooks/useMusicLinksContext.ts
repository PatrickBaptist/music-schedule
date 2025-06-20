import { useContext } from 'react';
import { MusicLinksService, MusicLinksContextProps } from '../../services/MusicLinksService';

export const useMusicLinksContext = (): MusicLinksContextProps => {
  const context = useContext(MusicLinksService);
  if (!context) {
    throw new Error('useMusicLinksContext must be used within a MusicLinksProvider');
  }
  return context;
};

export default useMusicLinksContext;