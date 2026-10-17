import React, { useState, useEffect } from 'react';
import useMusicLinksContext from '../../context/hooks/useMusicLinksContext';
import Button from '../buttons/Buttons';
import { ChordSheetFields, InputContainer, SuggestionsList } from './MusicLinkInputStyle';
import { SelectContainer } from '../musicList/MusicLinkListStyle';
import { toast } from 'sonner';
import useAuthContext from '../../context/hooks/useAuthContext';
import { UserRole } from '../../types/UserRole';
import useUsersContext from '../../context/hooks/useUsersContext';
import useAllMusicHistoryContext from '../../context/hooks/useAllMusicHistoryContext';
import { FaPlus } from 'react-icons/fa';
import { AllMusicLink } from '../../services/AllMusicHistory';
import LoadingScreen from '../loading/LoadingScreen';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import { WORSHIP_MOMENTS } from '../../constants/worshipMoments';

type MusicLinkInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleDate: string;
  onScheduleDateChange: (date: string) => void;
};

const MusicLinkInput: React.FC<MusicLinkInputProps> = ({
  setIsModalOpen,
  scheduleDate,
  onScheduleDateChange,
}) => {

  const tons = [
    'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em',
    'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am',
    'A#', 'A#m', 'B', 'Bm'
  ];

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [letter, setLetter] = useState('');
  const [lyricsChords, setLyricsChords] = useState('');
  const [chordSourceKey, setChordSourceKey] = useState('');
  const [spotify, setSpotify] = useState('');
  const [cifra, setCifra] = useState('');
  const [description, setDescription] = useState('');
  const [worshipMoment, setWorshipMoment] = useState('');
  const [, setOrder] = useState(1);
  const { addMusicLink } = useMusicLinksContext();
  const { musicLinks, getAllMusicLinksFull } = useAllMusicHistoryContext();
  const { user } = useAuthContext();
  const { users } = useUsersContext();
  const [ministerModalOpen, setMinisterModalOpen] = useState(false);
  const [ministerName, setMinisterName] = useState('');
  const [suggestions, setSuggestions] = useState<AllMusicLink[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [worshipMomentModalOpen, setWorshipMomentModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<AllMusicLink | null>(null);

  useBodyScrollLock(true);

  useEffect(() => {
    getAllMusicLinksFull().catch((err) => console.error("Erro ao carregar músicas:", err));
  }, [getAllMusicLinksFull]);

  const handleAddLink = async () => {

    if (!scheduleDate) {
      toast.error("Selecione a data do culto!");
      return;
    }

    if (!worshipMoment.trim()) {
      toast.error("O momento do louvor é obrigatório!");
      return;
    }

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
      worshipMoment: worshipMoment.trim(),
      letter: letter.trim() || "",
      lyricsChords: lyricsChords.trim() || "",
      chordSourceKey: chordSourceKey || cifra,
      spotify: spotify.trim() || "",
      cifra: cifra.trim() || "",
      description: description.trim() || "",
      ministeredBy: isMinister ? user?.nickname : ministerName,
      scheduleDate
    });

    setIsModalOpen(false);
    setName('');
    setWorshipMoment('');
    setLink('');
    setLetter('');
    setLyricsChords('');
    setChordSourceKey('');
    setSpotify('');
    setCifra('');
    setDescription('');
    setOrder(1);
    setMinisterName('');

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    setSuggestionsLoading(true);

    const normalizedValue = normalizeString(value);
    const searchWords = normalizedValue.split(" ").filter(Boolean);

    const filtered = musicLinks
      .filter(m => {
        const normalizedName = normalizeString(m.name);
        return searchWords.every(word => normalizedName.includes(word));
      })
      .slice(0, 5);

    setSuggestions(filtered);
    setSuggestionsLoading(false);
  };

  const ministerUsers = users.filter((u) => u.roles?.includes(UserRole.Minister) || u.roles?.includes(UserRole.Guest));

  const handleSelectSuggestion = async (music: AllMusicLink) => {
    setSuggestions([]);
    setSelectedMusic(music);
    setWorshipMomentModalOpen(true);
  };

  const confirmAddWithMoment = async () => {
    if (!selectedMusic || !worshipMoment.trim()) {
      toast.error("Selecione o momento do louvor antes de continuar!");
      return;
    }

    const toastId = toast.loading("Adicionando música...");

    try {
      await addMusicLink({
        name: selectedMusic.name.trim(),
        worshipMoment: worshipMoment.trim(),
        link: selectedMusic.link || "",
        letter: selectedMusic.letter || "",
        lyricsChords: selectedMusic.lyricsChords || "",
        chordSourceKey: selectedMusic.chordSourceKey || selectedMusic.cifra || "",
        spotify: selectedMusic.spotify || "",
        cifra: selectedMusic.cifra || "",
        description: selectedMusic.description || "",
        ministeredBy: selectedMusic.minister || "",
        scheduleDate
      });

      toast.success(`"${selectedMusic.name}" adicionada com sucesso!`, { id: toastId });
      setWorshipMomentModalOpen(false);
      setSelectedMusic(null);
      setWorshipMoment('');
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro ao adicionar: " + err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao adicionar música", { id: toastId });
      }
    }
  };

  return (
    <InputContainer className="music-add-form">
      <div className="selected-date-summary">
        <label htmlFor="add-music-schedule-date">Data do repertório</label>
        <input
          id="add-music-schedule-date"
          type="date"
          value={scheduleDate}
          onChange={(event) => onScheduleDateChange(event.target.value)}
        />
        <span>A música será exibida no repertório desta data.</span>
      </div>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Ex.: Grande é o Senhor"
        onKeyDown={handleKeyPress}
      />

      {name.trim() !== "" && (
        <SuggestionsList>
        {suggestionsLoading ? (
          <div style={{ margin: 20 }}>
            <LoadingScreen />
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((s) => (
            <li key={s.id} onClick={() => handleSelectSuggestion(s)}>
              <div className="suggestion-content">
                <span className="music-name">{s.name}</span>
                <span
                  className="music-minister"
                  style={{ marginLeft: 8, fontSize: 12, color: "#aaa" }}
                >
                  Min.: {s.minister}
                </span>
                <span className="add-label" style={{ marginLeft: "auto" }}>
                  Adicionar <FaPlus size={12} />
                </span>
              </div>
            </li>
          ))
        ) : (
          <div style={{ padding: 10 }}>Nenhuma sugestão encontrada</div>
        )}
        </SuggestionsList>
      )}
        
      <div className="music-add-main-fields">
        <SelectContainer>
          <label htmlFor="worshipMoment">Momento do Louvor</label>
          <select
            id="worshipMoment"
            value={worshipMoment}
            onChange={(e) => setWorshipMoment(e.target.value)}
            onKeyDown={handleKeyPress}
          >
            <option value="">Selecione o momento</option>
            {WORSHIP_MOMENTS.map((moment) => (
              <option key={moment} value={moment}>
                {moment}
              </option>
            ))}
          </select>
        </SelectContainer>
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
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link do vídeo"
          onKeyDown={handleKeyPress}
        />
      </div>

      <details className="music-add-more-options">
        <summary>Mais opções</summary>
        <div className="music-add-more-options-content">
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
          <ChordSheetFields aria-labelledby="pasted-chord-key-label">
            <label id="pasted-chord-key-label" htmlFor="chord-source-key">Tom em que a cifra foi colada</label>
            <select id="chord-source-key" value={chordSourceKey} onChange={(e) => setChordSourceKey(e.target.value)}>
              {tons.map((tom) => <option key={tom} value={tom}>{tom}</option>)}
            </select>
            <label htmlFor="schedule-lyrics-chords">Letra com cifra</label>
            <textarea
              id="schedule-lyrics-chords"
              value={lyricsChords}
              onChange={(e) => setLyricsChords(e.target.value)}
              placeholder="Cole a letra com os acordes aqui"
              rows={14}
            />
          </ChordSheetFields>
          <div className="music-add-description">
            <label htmlFor="description">Observações sobre a música</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Observações sobre como será a música"
              rows={3}
            />
          </div>
        </div>
      </details>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={handleAddLink}>
          Adicionar
        </Button>
      </div>
      {ministerModalOpen && (
        <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', backgroundColor: 'rgba(8, 15, 24, 0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '82px 12px 106px', boxSizing: 'border-box', overflowY: 'auto', zIndex: 10010 }}>
          <InputContainer>
            <h3>Selecione quem irá ministrar a música</h3>
            <SelectContainer>
              <select
                value={ministerName}
                onChange={(e) => setMinisterName(e.target.value)}
                style={{ backgroundColor: 'var(--color-input-bg)', color: 'var(--color-input-text)', border: '1px solid var(--color-border)' }}
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
      {worshipMomentModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(8, 15, 24, 0.78)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '82px 12px 106px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          zIndex: 10011
        }}>
          <InputContainer style={{ backgroundColor: 'var(--color-surface)', padding: 24, borderRadius: 18 }}>
            <h3>Selecione o momento do louvor</h3>
            <SelectContainer>
              <select
                value={worshipMoment}
                onChange={(e) => setWorshipMoment(e.target.value)}
                style={{ backgroundColor: 'var(--color-input-bg)', color: 'var(--color-input-text)', border: '1px solid var(--color-border)' }}
              >
                <option value="">Selecione o momento</option>
                {WORSHIP_MOMENTS.map((moment) => (
                  <option key={moment} value={moment}>
                    {moment}
                  </option>
                ))}
              </select>
            </SelectContainer>

            <div style={{ marginTop: 20, display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="secondary" onClick={() => setWorshipMomentModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmAddWithMoment}>Confirmar</Button>
            </div>
          </InputContainer>
        </div>
      )}
    </InputContainer>
  );
};

export default MusicLinkInput;
