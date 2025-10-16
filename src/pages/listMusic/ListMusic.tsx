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
import { FaTrash } from "react-icons/fa";

const tons = [
  'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em',
  'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am',
  'A#', 'A#m', 'B', 'Bm'
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

  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [letter, setLetter] = useState('');
  const [cifra, setCifra] = useState('');
  const [minister, setMinister] = useState('');
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const [ editIndex, setEditIndex ] = useState<string | null>(null);
  const [ loadingCards, setLoadingCards ] = useState<{ [key: string]: boolean }>({});

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
    setSearchTerm(term);
    getAllMusicLinks({ page: 1, limit, search: term.toLowerCase() });
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
    
    try {
      const toastId = toast.loading("Adicionando à lista de domingo...");
      await addMusicLink({
        id: music.id,
        name: music.name,
        link: music.link || "",
        cifra: music.cifra || "",
        letter: music.letter  || "",
        ministeredBy: music.minister
      });

      toast.success("Música adicionada ao domingo com sucesso!", { id: toastId });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro ao adicionar: " + err.message);
      } else {
        toast.error("Erro desconhecido ao adicionar");
      }
    }
  };

  const handleUpdate = (id: string) => {
    const musicLink = musicLinks.find(m => m.id === id);
    if (!musicLink) return;

      setName(musicLink.name);
      setLink(musicLink.link || '');
      setLetter(musicLink.letter || '');
      setCifra(musicLink.cifra || '');
      setMinister(musicLink.minister || '');
      setEditIndex(musicLink.id!);
      setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editIndex) {
      setLoadingCards(prev => ({ ...prev, [editIndex]: true }));
      const updatedLink = { name, link, letter, cifra, minister };
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

  const sortedMusicLinks = [...musicLinks].sort((a, b) => 
    getTime(b.createdAt) - getTime(a.createdAt)
  );


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
                  {sortedMusicLinks.map((music) => (
                    <motion.div
                      key={music.id}
                      className="container-card-music"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -200 }}
                      transition={{ duration: 0.4 }}
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
                                className="btns"
                                style={{ backgroundColor: "#a371f7", color: "#fff" }}
                                onClick={() => handleOpenVideo(music.link!)}
                              >
                                Vd
                              </motion.button>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btns"
                              style={{ backgroundColor: "#2f81f7", color: "#fff" }}
                              onClick={() => handleUpdate(music.id)}
                            >
                              Edit
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btns"
                              style={{ backgroundColor: "#3fb950", color: "#fff" }}
                              onClick={() => handleAddToSunday(music.id)}
                            >
                              add
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="btns delete-btn"
                              style={{ backgroundColor: "#da3633", color: "#fff" }}
                              onClick={() => handleDelete(music.id, music.name)}
                            >
                              <FaTrash style={{ marginRight: '6px' }} />
                              Del
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
        </PageWrapper>
      </Main>
    </Container>
  );
};

export default ListMusic;
