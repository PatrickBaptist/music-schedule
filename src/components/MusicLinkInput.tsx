import React, { useState } from 'react';
import { useMusicContext } from '../context/hooks/useMusicContext';
import styled from 'styled-components';
import Button from './Buttons';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  input {
    width: 350px;
    height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
    outline:  none;
    padding: 6px;
  }

  button {
    width: 150px;
    cursor: pointer;
  }
`;

const MusicLinkInput: React.FC = () => {
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const { addMusicLink } = useMusicContext();

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
      <Button onClick={handleAddLink}>Add</Button>
    </InputContainer>
  );
};

export default MusicLinkInput;