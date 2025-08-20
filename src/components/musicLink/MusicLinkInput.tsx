import React, { useState, useRef, useEffect } from 'react';
import { useMusicLinksContext } from '../../context/hooks/useMusicLinksContext';
import Button from '../buttons/Buttons';
import { InputContainer } from './MusicLinkInputStyle';
import { SelectContainer } from '../musicList/MusicLinkListStyle';
import { toast } from 'sonner';

type MusicLinkInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MusicLinkInput: React.FC<MusicLinkInputProps> = ({ setIsModalOpen }) => {

  const tons = [
    'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em',
    'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am',
    'A#', 'A#m', 'B', 'Bm'
  ];
  
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [letter, setLetter] = useState('');
  const [cifra, setCifra] = useState('');
  const [, setOrder] = useState(1);
  const { addMusicLink } = useMusicLinksContext();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleAddLink = async () => {
    setIsModalOpen(false)
    if (!name.trim()) {
      toast.error("O nome da música é obrigatório!");
      return;
    }
    
    const toastId = toast.loading("Aguarde...");
    
    try {
    await addMusicLink({ 
      name: name.trim(),
      link: link.trim() || "",
      letter: letter.trim() || "",
      cifra: cifra.trim() || "",
    });

    setIsModalOpen(false);
    setName('');
    setLink('');
    setLetter('');
    setCifra('');
    setOrder(1);

    nameInputRef.current?.focus();
    toast.success("Música adicionada com sucesso!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Erro ao adicionar a música. Tente novamente.", { id: toastId });
  }
};

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
        placeholder="Ex.: Grande é o Senhor"
        ref={nameInputRef}
        onKeyDown={handleKeyPress}
      />
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link da música"
        onKeyDown={handleKeyPress}
      />
      <input
        type="text"
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
        placeholder="Link da letra"
        onKeyDown={handleKeyPress}
      />

      <SelectContainer>
        <label htmlFor="cifra">Tom da Música</label>
        <select
          id="cifra"
          value={cifra}
          onChange={(e) => setCifra(e.target.value)}
        >
          <option value="">Selecione o tom</option>
          {tons.map((tom, index) => (
            <option key={index} value={tom}>
              {tom}
            </option>
          ))}
        </select>
      </SelectContainer>

      <Button onClick={handleAddLink}>
        Adicionar
      </Button>
      <Button onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#9e9e9e' }}>
        Cancelar
      </Button>
    </InputContainer>
  );
};

export default MusicLinkInput;