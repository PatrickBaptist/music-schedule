import React, { useState, useRef, useEffect } from 'react';
import useMusicLinksContext from '../../context/hooks/useMusicLinksContext';
import Button from '../buttons/Buttons';
import { InputContainer } from './MusicLinkInputStyle';
import { SelectContainer } from '../musicList/MusicLinkListStyle';
import { toast } from 'sonner';
import useAuthContext from '../../context/hooks/useAuthContext';
import { UserRole } from '../../types/UserRole';
import useUsersContext from '../../context/hooks/useUsersContext';

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
  const { user } = useAuthContext();
  const { users } = useUsersContext();
  const [ministerModalOpen, setMinisterModalOpen] = useState(false);
  const [ministerName, setMinisterName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleAddLink = async () => {
    if (!name.trim()) {
      toast.error("O nome da música é obrigatório!");
      return;
    }

    const isMinister = user?.roles?.includes(UserRole.Minister);
    if (!isMinister && !ministerName) {
      setMinisterModalOpen(true);
      return;
    }
    
    const toastId = toast.loading("Aguarde...");
    setIsModalOpen(false);
    
    try {
    await addMusicLink({ 
      name: name.trim(),
      link: link.trim() || "",
      letter: letter.trim() || "",
      cifra: cifra.trim() || "",
      ministeredBy: isMinister ? user?.name : ministerName
    });

    setIsModalOpen(false);
    setName('');
    setLink('');
    setLetter('');
    setCifra('');
    setOrder(1);
    setMinisterName('');

    nameInputRef.current?.focus();
    toast.success("Música adicionada com sucesso!", { id: toastId });
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error("Sem premissão! " + err.message, { id: toastId });
    } else {
      toast.error("Erro desconhecido ao adicionar", { id: toastId });
    }
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLink();
    }
  }

  const ministerUsers = users.filter((u) => u.roles?.includes(UserRole.Minister) || u.roles?.includes(UserRole.Guest));

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
      {ministerModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <InputContainer>
            <h3>Selecione quem irá ministrar a música</h3>
            <SelectContainer>
              <select
                value={ministerName}
                onChange={(e) => setMinisterName(e.target.value)}
              >
                <option value="">Selecione o ministro</option>
                {ministerUsers.map((m) => (
                  <option key={m.id} value={m.nickname}>{m.nickname}</option>
                ))}
              </select>
            </SelectContainer>
            <Button onClick={() => { setMinisterModalOpen(false); handleAddLink(); }}>
              Confirmar
            </Button>
            <Button onClick={() => setMinisterModalOpen(false)} style={{ backgroundColor: '#9e9e9e' }}>
              Cancelar
            </Button>
          </InputContainer>
        </div>
      )}
    </InputContainer>
  );
};

export default MusicLinkInput;