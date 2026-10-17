import React, { useState, useRef, useEffect } from 'react';
import Button from '../buttons/Buttons';
import { InputContainer, SelectContainer } from './AllMusicLinkInputStyle';
import { ChordSheetFields } from '../musicLink/MusicLinkInputStyle';
import { toast } from 'sonner';
import useAuthContext from '../../context/hooks/useAuthContext';
import { UserRole } from '../../types/UserRole';
import useAllMusicHistoryContext from '../../context/hooks/useAllMusicHistoryContext';
import useUsersContext from '../../context/hooks/useUsersContext';

type MusicLinkInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AllMusicLinkInput: React.FC<MusicLinkInputProps> = ({ setIsModalOpen }) => {

  const tons = [
    'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em',
    'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am',
    'A#', 'A#m', 'B', 'Bm'
  ];
  
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [letter, setLetter] = useState('');
  const [lyricsChords, setLyricsChords] = useState('');
  const [chordSourceKey, setChordSourceKey] = useState('');
  const [spotify, setSpotify] = useState('');
  const [cifra, setCifra] = useState('');
  const [, setOrder] = useState(1);
  const { addMusicLink } = useAllMusicHistoryContext();
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
        worshipMoment: "",
        letter: letter.trim() || "",
        lyricsChords: lyricsChords.trim() || "",
        chordSourceKey: chordSourceKey || cifra,
        spotify: spotify.trim() || "",
        cifra: cifra.trim() || "",
        minister: isMinister ? user?.name : ministerName
      });

      setIsModalOpen(false);
      setName('');
      setLink('');
      setLetter('');
      setLyricsChords('');
      setChordSourceKey('');
      setSpotify('');
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
    <InputContainer className="music-library-form">
      <div className="music-library-main-fields">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Grande é o Senhor"
          ref={nameInputRef}
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
              <option key={index} value={tom}>{tom}</option>
            ))}
          </select>
        </SelectContainer>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link do vídeo"
          onKeyDown={handleKeyPress}
        />
      </div>
      <details className="music-library-more-options">
        <summary>Mais opções</summary>
        <div className="music-library-more-options-content">
          <input
            type="text"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            placeholder="Link da letra"
            onKeyDown={handleKeyPress}
          />
          <input
            type="text"
            value={spotify}
            onChange={(e) => setSpotify(e.target.value)}
            placeholder="Link do Spotify"
            onKeyDown={handleKeyPress}
          />
          <ChordSheetFields aria-labelledby="history-chord-source-key-label">
            <label id="history-chord-source-key-label" htmlFor="history-chord-source-key">
              Tom em que a cifra foi colada
            </label>
            <select
              id="history-chord-source-key"
              value={chordSourceKey}
              onChange={(e) => setChordSourceKey(e.target.value)}
            >
              {tons.map((tom) => <option key={tom} value={tom}>{tom}</option>)}
            </select>
            <label htmlFor="history-lyrics-chords">Letra com cifra</label>
            <textarea
              id="history-lyrics-chords"
              value={lyricsChords}
              onChange={(e) => setLyricsChords(e.target.value)}
              placeholder="Cole a letra com os acordes aqui"
              rows={14}
            />
          </ChordSheetFields>
        </div>
      </details>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={handleAddLink}>
          Adicionar
        </Button>
      </div>
      {ministerModalOpen && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <InputContainer>
                  <h3>Selecione quem irá ministrar a música</h3>
                  <SelectContainer>
                    <select
                      value={ministerName}
                      onChange={(e) => setMinisterName(e.target.value)}
                      style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #555' }}
                    >
                      <option value="">Selecione o ministro</option>
                      {ministerUsers.map((m) => (
                        <option key={m.id} value={m.nickname}>{m.nickname}</option>
                      ))}
                    </select>
                  </SelectContainer>
                  <div style={{ width: '100%', marginTop: 20, display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
                    <Button variant="secondary" onClick={() => setMinisterModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => { setMinisterModalOpen(false); handleAddLink(); }}>
                      Confirmar
                    </Button>
                  </div>
                </InputContainer>
              </div>
            )}
    </InputContainer>
  );
};

export default AllMusicLinkInput;
