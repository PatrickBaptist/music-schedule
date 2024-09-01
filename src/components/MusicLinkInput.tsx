import React, { useState } from 'react';
import { useMusicLinksContext } from '../context/hooks/useMusicLinksContext';
import Button from './Buttons';
import { InputContainer } from './styles/MusicLinkInput';

const MusicLinkInput: React.FC = () => {
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const { addMusicLink } = useMusicLinksContext();

  const handleAddLink = () => {
    if (link && name) {
      addMusicLink({ link, name });
      setLink('');
      setName('');
    }
  };

  return (
    <InputContainer>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex.: 1 - Grande é o Senhor"
      />
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link da música"
      />
      <Button onClick={handleAddLink}>
        Adicionar
      </Button>
    </InputContainer>
  );
};

export default MusicLinkInput;