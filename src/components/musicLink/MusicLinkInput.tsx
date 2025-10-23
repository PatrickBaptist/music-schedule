import React, { useState, useRef, useEffect } from 'react';
import useMusicLinksContext from '../../context/hooks/useMusicLinksContext';
import Button from '../buttons/Buttons';
import { InputContainer, SuggestionsList } from './MusicLinkInputStyle';
import { SelectContainer } from '../musicList/MusicLinkListStyle';
import { toast } from 'sonner';
import useAuthContext from '../../context/hooks/useAuthContext';
import { UserRole } from '../../types/UserRole';
import useUsersContext from '../../context/hooks/useUsersContext';
import useAllMusicHistoryContext from '../../context/hooks/useAllMusicHistoryContext';
import { FaPlus } from 'react-icons/fa';
import { AllMusicLink } from '../../services/AllMusicHistory';

type MusicLinkInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MusicLinkInput: React.FC<MusicLinkInputProps> = ({ setIsModalOpen }) => {

  const tons = [
    'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em',
    'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am',
    'A#', 'A#m', 'B', 'Bm'
  ];

  const worshipMoments = [
    "Momento de Louvor",
    "Dízimos e Ofertas",
    "Batismo",
    "Ceia",
    "Final do Culto",
    "Culto de Quinta",
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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<AllMusicLink[]>([]);
  const [worshipMomentModalOpen, setWorshipMomentModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<AllMusicLink | null>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    getAllMusicLinksFull().catch((err) => console.error("Erro ao carregar músicas:", err));
  }, [getAllMusicLinksFull]);

  const handleAddLink = async () => {

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
      spotify: spotify.trim() || "",
      cifra: cifra.trim() || "",
      description: description.trim() || "",
      ministeredBy: isMinister ? user?.nickname : ministerName
    });

    setIsModalOpen(false);
    setName('');
    setWorshipMoment('');
    setLink('');
    setLetter('');
    setSpotify('');
    setCifra('');
    setDescription('');
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const normalizedValue = normalizeString(value);
    const searchWords = normalizedValue.split(" ").filter(Boolean);

    const filtered = musicLinks
      .filter(m => {
        const normalizedName = normalizeString(m.name);
        return searchWords.every(word => normalizedName.includes(word));
      })
      .slice(0, 5);

    setSuggestions(filtered);
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
        id: selectedMusic.id,
        name: selectedMusic.name.trim(),
        worshipMoment: worshipMoment.trim(),
        link: selectedMusic.link || "",
        letter: selectedMusic.letter || "",
        spotify: selectedMusic.spotify || "",
        cifra: selectedMusic.cifra || "",
        description: selectedMusic.description || "",
        ministeredBy: selectedMusic.minister || ""
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
    <InputContainer>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Ex.: Grande é o Senhor"
        ref={nameInputRef}
        onKeyDown={handleKeyPress}
      />
      {suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSelectSuggestion(s)}
            >
              <div className="suggestion-content">
                <span className="music-name">{s.name}</span>
                <span className="music-minister" style={{ marginLeft: 8, fontSize: 12, color: "#aaa" }}>
                  Min.: {s.minister}
                </span>
                <span className="add-label" style={{ marginLeft: "auto" }}>
                  Adicionar <FaPlus size={12} />
                </span>
              </div>
            </li>
          ))}
        </SuggestionsList>
      )}
      <SelectContainer>
        <label htmlFor="worshipMoment">Momento do Louvor</label>
        <select
          id="worshipMoment"
          value={worshipMoment}
          onChange={(e) => setWorshipMoment(e.target.value)}
          onKeyDown={handleKeyPress}
          >
          <option value="">Selecione o momento</option>
          {worshipMoments.map((moment) => (
            <option key={moment} value={moment}>
              {moment}
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
      
      <div style={{ width: '100%',display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
        <label htmlFor="description" style={{ fontSize: 14, fontWeight: 'bold' }}>Observações sobre a música</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Observações sobre como será a música"
          rows={3}
          style={{
            width: '95%',
            height: '150px',
            marginTop: '8px',
            marginBottom: '8px',
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            resize: 'none'
          }}
        />
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#9e9e9e' }}>
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
      {worshipMomentModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <InputContainer style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8 }}>
            <h3>Selecione o momento do louvor</h3>
            <SelectContainer>
              <select
                value={worshipMoment}
                onChange={(e) => setWorshipMoment(e.target.value)}
              >
                <option value="">Selecione o momento</option>
                {worshipMoments.map((moment) => (
                  <option key={moment} value={moment}>
                    {moment}
                  </option>
                ))}
              </select>
            </SelectContainer>

            <div style={{ marginTop: 20, display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button onClick={confirmAddWithMoment}>Confirmar</Button>
              <Button onClick={() => setWorshipMomentModalOpen(false)} style={{ backgroundColor: '#9e9e9e' }}>
                Cancelar
              </Button>
            </div>
          </InputContainer>
        </div>
      )}
    </InputContainer>
  );
};

export default MusicLinkInput;