import { useContext } from 'react';
import { MusicLinksService, MusicLinksContextProps } from '../../services/MusicLinksService';
import { toast } from 'sonner';

export const useMusicLinksContext = (): MusicLinksContextProps => {
  const context = useContext(MusicLinksService);
  if (!context) {
    toast.error('erro ao buscar músicas');
    throw new Error('useMusicLinksContext must be used within a MusicLinksProvider');
  }
  return context;
};

export default useMusicLinksContext;