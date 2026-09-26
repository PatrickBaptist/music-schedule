import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import useAllMusicHistoryContext from "../../context/hooks/useAllMusicHistoryContext";
import Button, { MotionButton } from "../../components/buttons/Buttons";
import { AddFormOverlay, Container, Input, ListContainer, Main, SelectContainer } from "./ListMusicStyle";
import { FirestoreTimestamp } from "../../helpers/helpers";
import { toast } from "sonner";
import useMusicLinksContext from "../../context/hooks/useMusicLinksContext";
import AllMusicLinkInput from "../../components/allMusicLink/AllMusicLinkInput";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import LoadingScreen from "../../components/loading/LoadingScreen";
import { useScroll } from "../../context/hooks/useScroll";
import { FaEdit, FaEllipsisV, FaFileAlt, FaPlus, FaSpotify, FaTimes, FaTrash, FaYoutube } from "react-icons/fa";
import { AllMusicLink } from "../../services/AllMusicHistory";
import { InputContainer } from "../../components/allMusicLink/AllMusicLinkInputStyle";
import { MdPlaylistAdd } from "react-icons/md";
import { UserRole } from "../../types/UserRole";
import useAuthContext from "../../context/hooks/useAuthContext";
import useBodyScrollLock from "../../context/hooks/useBodyScrollLock";
import { WORSHIP_MOMENTS } from "../../constants/worshipMoments";
import useVideoPlayerContext from "../../context/hooks/useVideoPlayerContext";

const tons = [
  'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em',
  'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am',
  'A#', 'A#m', 'B', 'Bm'
];

const ListMusic: React.FC = () => {
  const { musicLinks, loading, getAllMusicLinks, currentPage, hasNextPage, hasPrevPage, updateMusicLink, removeMusicLink } = useAllMusicHistoryContext();
  const { openVideo } = useVideoPlayerContext();
  const [ isLoading, setIsLoading ] = useState(false);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { addMusicLink } = useMusicLinksContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollToTop } = useScroll();
  const [selectedMusic, setSelectedMusic] = useState<AllMusicLink | null>(null);
  const [worshipMomentModalOpen, setWorshipMomentModalOpen] = useState(false);
  const [selectedWorshipMoment, setSelectedWorshipMoment] = useState("");
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const { user: loggedUser } = useAuthContext();

  const loggedRoles = loggedUser?.roles || [];
  const allowedRoles = [UserRole.Leader, UserRole.Minister, UserRole.Admin, UserRole.Vocal];
  const canAddMusic = loggedRoles.some(role => allowedRoles.includes(role as UserRole));

  const allowedRolesBtns = [UserRole.Leader, UserRole.Minister, UserRole.Admin];
  const canDeleteMusic = loggedRoles.some(role => allowedRolesBtns.includes(role as UserRole));

  const [name, setName] = useState('');
  const [worshipMoment, setWorshipMoment] = useState('');
  const [link, setLink] = useState('');
  const [letter, setLetter] = useState('');
  const [spotify, setSpotify] = useState('');
  const [cifra, setCifra] = useState('');
  const [, setDescription] = useState('');
  const [minister, setMinister] = useState('');
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const [ editIndex, setEditIndex ] = useState<string | null>(null);
  const [ loadingCards, setLoadingCards ] = useState<{ [key: string]: boolean }>({});
  const [filteredMusicLinks, setFilteredMusicLinks] = useState<AllMusicLink[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  useEffect(() => {
    setFilteredMusicLinks(musicLinks);
  }, [musicLinks]);

  useBodyScrollLock(isModalOpen || isEditing || worshipMomentModalOpen);

  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoading(true);
      try {
        await getAllMusicLinks({ page: 1, limit });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusic();
  }, [getAllMusicLinks, limit]);


  const handleSearch = (term: string) => {
    const normalized = normalizeString(term);
    setSearchTerm(term);
    getAllMusicLinks({ page: 1, limit, search: normalized });
  };

  const handleAddToSunday = async (id: string) => {
    const music = musicLinks.find((m) => m.id === id);
    if (!music) {
      toast.error("Música não encontrada!");
      return;
    }
    
    setSelectedMusic(music);
    setWorshipMomentModalOpen(true);

  };

  const confirmAddWithMoment = async () => {
    if (!selectedMusic || !selectedWorshipMoment.trim() || !selectedScheduleDate) {
      toast.error("Selecione a data e o momento do louvor antes de continuar!");
      return;
    }

    const toastId = toast.loading("Adicionando ao repertório...");

    try {
      await addMusicLink({
        id: selectedMusic.id,
        name: selectedMusic.name,
        link: selectedMusic.link || "",
        worshipMoment: selectedWorshipMoment.trim(),
        cifra: selectedMusic.cifra || "",
        letter: selectedMusic.letter || "",
        spotify: selectedMusic.spotify || "",
        description: selectedMusic.description || "",
        ministeredBy: selectedMusic.minister,
        scheduleDate: selectedScheduleDate
      });

      toast.success("Música adicionada ao repertório da data escolhida!", { id: toastId });
      setWorshipMomentModalOpen(false);
      setSelectedWorshipMoment("");
      setSelectedMusic(null);
    } catch (err: unknown) {
      toast.error("Erro ao adicionar música!", { id: toastId });
    }
  };

  const handleUpdate = (id: string) => {
    const musicLink = musicLinks.find(m => m.id === id);
    if (!musicLink) return;

      setName(musicLink.name);
      setWorshipMoment(musicLink.worshipMoment);
      setLink(musicLink.link || '');
      setLetter(musicLink.letter || '');
      setSpotify(musicLink.spotify || '');
      setCifra(musicLink.cifra || '');
      setDescription(musicLink.description || '');
      setMinister(musicLink.minister || '');
      setEditIndex(musicLink.id!);
      setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editIndex) {
      setLoadingCards(prev => ({ ...prev, [editIndex]: true }));
      const updatedLink = { name, link, worshipMoment, letter, spotify, cifra, minister };
      setIsEditing(false);

      try {
        await updateMusicLink(editIndex, updatedLink);
        toast.success("Link editado com sucesso!");
      } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error("Sem premissão! " + err.message);
          } else {
              toast.error("Erro desconhecido ao editar");
          }
      } finally {
      setLoadingCards(prev => ({ ...prev, [editIndex]: false }));
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async (id: string, musicName: string) => {
    toast(
      `Deseja realmente deletar a música "${musicName}"?`,
      {
        action: {
          label: "Deletar",
          onClick: async () => {
            const toastId = toast.loading("Aguarde...");
            try {
              await removeMusicLink(id);
              await getAllMusicLinks({ page: currentPage, limit, search: searchTerm.toLowerCase() });
              toast.success("Música deletada com sucesso!", { id: toastId });
            } catch (err) {
              if (err instanceof Error) {
                toast.error("Sem premissão! " + err.message, { id: toastId });
              } else {
                  toast.error("Erro desconhecido ao editar", { id: toastId });
              }
            }
          },
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    }
  }

  const getTime = (date: string | Date | FirestoreTimestamp | undefined) => {
    if (!date) return 0;

    if (typeof date === "object" && date !== null && "_seconds" in date) {
      return new Date(date._seconds * 1000 + Math.floor(date._nanoseconds / 1000000)).getTime();
    }

    if (date instanceof Date) return date.getTime();

    return new Date(date).getTime();
  };

  const sortedMusic = useMemo(() => {
    return [...filteredMusicLinks].sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt));
  }, [filteredMusicLinks]);

  const isPageLoading = isLoading || loading;

  return (
    <Container>

      <Main>
        <PageWrapper>
          <ListContainer>
            <div className="library-toolbar">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Pesquisar música..."
              />
              {canAddMusic && (
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  <FaPlus aria-hidden="true" /> Adicionar música
                </Button>
              )}
            </div>

            {isModalOpen &&
              createPortal(
                <AddFormOverlay
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                >
                  <AllMusicLinkInput setIsModalOpen={setIsModalOpen}/>
                </AddFormOverlay>,
                document.body
              )}

            {isEditing &&
              createPortal(
                <AddFormOverlay
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                >
                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <InputContainer style={{ width: "min(100%, 620px)" }}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome da música"
                      onKeyDown={handleKeyPress}
                    />
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
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", gap: "10px" }}>
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveEdit}>
                          Salvar
                        </Button>
                      </div>
                    </InputContainer>
                  </div>
                </AddFormOverlay>,
                document.body
              )}

            {isPageLoading ? (
              <LoadingScreen />
            ) : (
              <div className="container">
                {!musicLinks.length && <p>Nenhuma música encontrada.</p>}

                {musicLinks.length > 0 && (
                  <p>
                    {searchTerm
                      ? `Resultados para "${searchTerm}": ${musicLinks.length}`
                      : `Mostrando ${musicLinks.length} músicas`}
                  </p>
                )}
                <AnimatePresence>
                  {sortedMusic.map((music) => (
                    <motion.div
                      key={music.id}
                      className="container-card-music"
                    >
                      {loadingCards[music.id!] ? (
                        <p style={{ color: '#fff' }}>Aguarde..</p>
                      ) : (
                        <>
                          <div className="music-card-header">
                            <div className="music-card-copy">
                              <strong>{music.name}</strong>
                              <span>Ministro: {music.minister || 'Não definido'}</span>
                            </div>
                            {music.cifra && <span className="span-cifra" title="Tom da música">{music.cifra}</span>}
                            <MotionButton
                              variant="unstyled"
                              whileTap={{ scale: 0.95 }}
                              className="toggle-btn"
                              onClick={() => setOpenMenuId((current) => current === music.id ? null : music.id!)}
                              title={openMenuId === music.id ? 'Ocultar ações' : 'Mostrar mais ações'}
                              aria-label={openMenuId === music.id ? `Ocultar ações de ${music.name}` : `Mostrar ações de ${music.name}`}
                            >
                              {openMenuId === music.id ? <FaTimes /> : <FaEllipsisV />}
                            </MotionButton>
                          </div>

                          {music.description?.trim() && (
                            <div className="description-preview">{music.description}</div>
                          )}

                          <div className="desktop-music-links" aria-label="Links da música">
                            {music.link && (
                              <Button variant="secondary"
                                onClick={() => openVideo(music.link!, music.name)}
                                title="Assistir vídeo"
                              >
                                <FaYoutube aria-hidden="true" /> YouTube
                              </Button>
                            )}
                            {music.letter && (
                              <Button variant="secondary" onClick={() => window.open(music.letter!, '_blank')} title="Abrir letra">
                                <FaFileAlt aria-hidden="true" /> Letra
                              </Button>
                            )}
                            {music.spotify && (
                              <Button variant="secondary" onClick={() => window.open(music.spotify!, '_blank')} title="Abrir no Spotify">
                                <FaSpotify aria-hidden="true" /> Spotify
                              </Button>
                            )}
                          </div>

                          <AnimatePresence>
                            {openMenuId === music.id && (
                              <motion.div className="music-buttons" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                {music.link && <MotionButton variant="unstyled" className="btns youtube-btn mobile-link-action" onClick={() => openVideo(music.link!, music.name)} title="Assistir vídeo"><FaYoutube /></MotionButton>}
                                {music.letter && <MotionButton variant="unstyled" className="btns letter-btn mobile-link-action" onClick={() => window.open(music.letter!, '_blank')} title="Abrir letra"><FaFileAlt /></MotionButton>}
                                {music.spotify && <MotionButton variant="unstyled" className="btns spotify-btn mobile-link-action" onClick={() => window.open(music.spotify!, '_blank')} title="Abrir no Spotify"><FaSpotify /></MotionButton>}
                                <MotionButton variant="unstyled" className="btns edit-btn" onClick={() => handleUpdate(music.id)} title="Editar música" aria-label={`Editar ${music.name}`}>
                                  <FaEdit />
                                </MotionButton>

                                {canDeleteMusic && (
                                  <MotionButton variant="unstyled" className="btns delete-btn" onClick={() => handleDelete(music.id, music.name)} title="Excluir música" aria-label={`Excluir ${music.name}`}>
                                    <FaTrash />
                                  </MotionButton>
                                )}

                                {canAddMusic && (
                                  <MotionButton variant="unstyled" className="btns add-btn" onClick={() => handleAddToSunday(music.id)} title="Adicionar ao repertório" aria-label={`Adicionar ${music.name} ao repertório`}>
                                    <MdPlaylistAdd />
                                  </MotionButton>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "45px", marginTop: "50px", paddingBottom: "70px" }}>
              <Button variant="secondary"
                disabled={!hasPrevPage} 
                onClick={() => {
                  getAllMusicLinks({ page: currentPage - 1, limit });
                  scrollToTop();
                }}
              >
                Anterior
              </Button>

              <span><strong>Página {currentPage}</strong></span>

              <Button variant="secondary"
                disabled={!hasNextPage}
                onClick={() => {
                  getAllMusicLinks({ page: currentPage + 1, limit });
                  scrollToTop();
                }}
                >
                Próxima
              </Button>
          </div>
          </ListContainer>

          {worshipMomentModalOpen &&
            createPortal(
              <AddFormOverlay
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              >
                <InputContainer style={{ backgroundColor: 'var(--color-surface)' }}>
                  <h3>Adicionar ao repertório</h3>
                  <SelectContainer>
                    <label htmlFor="library-schedule-date">Data do repertório</label>
                    <input
                      id="library-schedule-date"
                      type="date"
                      value={selectedScheduleDate}
                      onChange={(event) => setSelectedScheduleDate(event.target.value)}
                      style={{ backgroundColor: 'var(--color-input-bg)', color: 'var(--color-input-text)', border: '1px solid var(--color-border)' }}
                    />
                  </SelectContainer>
                  <SelectContainer>
                    <label htmlFor="library-worship-moment">Momento do louvor</label>
                    <select
                      id="library-worship-moment"
                      value={selectedWorshipMoment}
                      onChange={(e) => setSelectedWorshipMoment(e.target.value)}
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

                  <div style={{ width: '100%', marginTop: 20, display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
                    <Button variant="secondary" onClick={() => setWorshipMomentModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={confirmAddWithMoment}>Confirmar</Button>
                  </div>
                </InputContainer>
              </AddFormOverlay>,
              document.body
            )}
        </PageWrapper>
      </Main>
    </Container>
  );
};

export default ListMusic;
