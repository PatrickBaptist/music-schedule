import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useAllMusicHistoryContext from "../../context/hooks/useAllMusicHistoryContext";
import Button from "../../components/buttons/Buttons";
import Loading from "../../assets/Loading.gif";
import { Container, ContainerVd, ContentVd, Input, ListContainer, Main, SelectContainer } from "./ListMusicStyle";
import { FirestoreTimestamp } from "../../helpers/helpers";
import EditLink from '../../assets/imgs/edit.png';
import { toast } from "sonner";
import useMusicLinksContext from "../../context/hooks/useMusicLinksContext";
import AllMusicLinkInput from "../../components/allMusicLink/AllMusicLinkInput";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import LoadingScreen from "../../components/loading/LoadingScreen";
import { useScroll } from "../../context/hooks/useScroll";
import { FaEdit, FaPlus, FaTrash, FaYoutube } from "react-icons/fa";
import { AllMusicLink } from "../../services/AllMusicHistory";
import { InputContainer } from "../../components/allMusicLink/AllMusicLinkInputStyle";

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

const ListMusic: React.FC = () => {
  const { musicLinks, getAllMusicLinks, currentPage, hasNextPage, hasPrevPage, updateMusicLink, removeMusicLink } = useAllMusicHistoryContext();
  const [openVideo, setOpenVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { addMusicLink } = useMusicLinksContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollToTop } = useScroll();
  const [selectedMusic, setSelectedMusic] = useState<AllMusicLink | null>(null);
  const [worshipMomentModalOpen, setWorshipMomentModalOpen] = useState(false);
  const [selectedWorshipMoment, setSelectedWorshipMoment] = useState("");

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

  const handleOpenVideo = (url: string) => {
    setCurrentVideo(url);
    setLoadingVideo(true);
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
    setCurrentVideo(null);
    setLoadingVideo(false);
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
    if (!selectedMusic || !selectedWorshipMoment.trim()) {
      toast.error("Selecione o momento do louvor antes de continuar!");
      return;
    }

    const toastId = toast.loading("Adicionando à lista de domingo...");

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
        ministeredBy: selectedMusic.minister
      });

      toast.success("Música adicionada ao domingo com sucesso!", { id: toastId });
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

  return (
    <Container>

      <Main>
        <PageWrapper>
          <ListContainer>
            <div style={{ width: "90%", maxWidth: "600px", display: "flex", alignItems: "center" }}>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Pesquisar música..."
              />
            </div>

            <div className='content-louvores'>
              <h4>Adicionar louvor</h4>
              <Button className='btn-write' onClick={() => setIsModalOpen(true)}>
                <img src={EditLink} alt="editLink" />
              </Button>
            </div>

            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <AllMusicLinkInput setIsModalOpen={setIsModalOpen}/>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="all-edit-form">
                <div className='all-edit-content'>
                  <div className="all-input-container">
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
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={handleCancelEdit} style={{ backgroundColor: '#9e9e9e', marginBottom: '10px' }}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveEdit} style={{ backgroundColor: '#007BFF', marginBottom: '10px' }}>
                          Salvar
                        </Button>
                      </div>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
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
                <AnimatePresence mode="wait">
                  {filteredMusicLinks
                    .sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt))
                    .map((music) => (
                    <motion.div
                      key={music.id}
                      className="container-card-music"
                    >
                      {loadingCards[music.id!] ? (
                        <p style={{ color: '#fff' }}>Aguarde..</p>
                      ) : (
                        <>
                          <div className="music-info">
                            <div className="span-cifra">{music.cifra || "-"}</div>
                            <div className="music-text">
                              <div className="span-music">{music.name}</div>
                              <span className="divider-music">-</span>
                              <div className="span-minister">Ministro: {music.minister}</div>
                            </div>
                          </div>

                          <div className="music-buttons">
                            {music.link && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btns youtube-btn"
                                onClick={() => handleOpenVideo(music.link!)}
                                title="Assistir vídeo"
                              >
                                <FaYoutube size={14} />
                              </motion.button>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btns edit-btn"
                              onClick={() => handleUpdate(music.id)}
                            >
                              <FaEdit size={14} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btns delete-btn"
                              onClick={() => handleDelete(music.id, music.name)}
                            >
                              <FaTrash size={14} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btns add-btn"
                              onClick={() => handleAddToSunday(music.id)}
                            >
                              <FaPlus size={14} />
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "45px", marginTop: "50px", paddingBottom: "70px" }}>
              <Button 
                disabled={!hasPrevPage} 
                onClick={() => {
                  getAllMusicLinks({ page: currentPage - 1, limit });
                  scrollToTop();
                }}
              >
                Anterior
              </Button>

              <span><strong>Página {currentPage}</strong></span>

              <Button 
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

          {openVideo && currentVideo && (
            <ContainerVd onClick={handleCloseVideo}>
              <ContentVd>
                {loadingVideo && (
                  <div className="loading-screen">
                    <img src={Loading} alt="Loading" style={{ width: "150px" }} />
                  </div>
                )}
                <iframe
                  width="560"
                  height="315"
                  src={currentVideo}
                  title="YouTube video player"
                  style={{ border: "none", display: loadingVideo ? "none" : "block" }}
                  onLoad={() => setLoadingVideo(false)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  />
              </ContentVd>
            </ContainerVd>
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
                    value={selectedWorshipMoment}
                    onChange={(e) => setSelectedWorshipMoment(e.target.value)}
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
        </PageWrapper>
      </Main>
    </Container>
  );
};

export default ListMusic;
