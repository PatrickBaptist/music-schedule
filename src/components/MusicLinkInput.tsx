import React, { useState, useRef, useEffect } from 'react';
import { useMusicLinksContext } from '../context/hooks/useMusicLinksContext';
import Button from './Buttons';
import { InputContainer } from './styles/MusicLinkInput';

const MusicLinkInput: React.FC = () => {
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const { addMusicLink } = useMusicLinksContext();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleAddLink = () => {
    if (link && name) {
      addMusicLink({ link, name });
      setLink('');
      setName('');

      nameInputRef.current?.focus();
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLink();
    }
  }

  return (
    <InputContainer>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex.: 1 - Grande é o Senhor"
        ref={nameInputRef}
      />
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link da música"
        onKeyDown={handleKeyPress}
      />
      <Button onClick={handleAddLink}>
        Adicionar
      </Button>
    </InputContainer>
  );
};

export default MusicLinkInput;