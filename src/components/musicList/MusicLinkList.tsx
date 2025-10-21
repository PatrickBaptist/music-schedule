import React, { useEffect, useState } from "react";
import useMusicLinksContext from "../../context/hooks/useMusicLinksContext";
import Button from "../buttons/Buttons";
import Loading from "../../assets/Loading.gif";
import Delete from "../../assets/imgs/delete.png";
import {
  ContainerVd,
  ContentVd,
  ListContainer,
  SelectContainer,
} from "./MusicLinkListStyle";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "../loading/LoadingScreen";
import { FaEdit, FaEllipsisV, FaFileAlt, FaRegCommentDots, FaSpotify, FaYoutube } from "react-icons/fa";

type Video = {
  url: string;
};

const MusicLinkList: React.FC = () => {
  const tons = [
    "C",
    "Cm",
    "C#",
    "C#m",
    "D",
    "Dm",
    "D#",
    "D#m",
    "E",
    "Em",
    "F",
    "Fm",
    "F#",
    "F#m",
    "G",
    "Gm",
    "G#",
    "G#m",
    "A",
    "Am",
    "A#",
    "A#m",
    "B",
    "Bm",
  ];

  const { musicLinks, fetchMusicLinks, removeMusicLink, updateMusicLink } =
    useMusicLinksContext();
  const [openVideo, setOpenVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState<{ [key: string]: boolean }>({});
  
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [letter, setLetter] = useState("");
  const [spotify, setSpotify] = useState("");
  const [cifra, setCifra] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  
  const [selectedDescription, setSelectedDescription] = useState<{
     description: string;
     name: string;
   } | null>(null);

  useEffect(() => {
    const fetchMusicLink = async () => {
      setIsLoading(true);
      try {
        await fetchMusicLinks();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicLink();
  }, [fetchMusicLinks]);

  const handleVideoClick = () => {
    setOpenVideo(false);
    setLoading(false);
  };

  const openLinkVideo = (videoUrl: Video) => {
    setCurrentVideo(videoUrl);
    setLoading(true);
    setOpenVideo(true);
  };

  const handleEditClick = (index: number) => {
    const musicLink = musicLinks[index];

    setName(musicLink.name);
    setLink(musicLink.link || "");
    setLetter(musicLink.letter || "");
    setSpotify(musicLink.spotify || "");
    setCifra(musicLink.cifra || "");
    setDescription(musicLink.description || "");
    setOrder(musicLink.order || 0);
    setEditIndex(musicLink.id!);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    setLoadingCards((prev) => ({ ...prev, [id]: true }));
    setIsEditing(false);
    setEditIndex(null);

    try {
      await removeMusicLink(id);
      toast.success("Link removido com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Sem premissão! " + err.message);
      } else {
        toast.error("Erro desconhecido ao remover");
      }
    } finally {
      setLoadingCards((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSaveEdit = async () => {
    if (editIndex) {
      setLoadingCards((prev) => ({ ...prev, [editIndex]: true }));
      const updatedLink = { name, link, letter, spotify, cifra, description, order };
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
        setLoadingCards((prev) => ({ ...prev, [editIndex]: false }));
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }
  };

  const handleCardClick = (description?: string, name?: string) => {
    if (name) {
      setSelectedDescription({ 
        description: description || "Sem instruções ou descrições.",
        name 
      });
    }
  };

  const closeModal = () => {
    setSelectedDescription(null);
  };

  const toggleButtons = (id: string) => {
    setShowButtons(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <ListContainer>
      <AnimatePresence>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          musicLinks.map((musicLink, index) => (
            <motion.div
              key={index}
              className="container-list"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.4 }}
            >
              <div className="container-card">
                <div className="card">
                  {loadingCards[musicLink.id!] ? (
                    <p style={{ color: "#fff" }}>Aguarde..</p>
                  ) : (
                    <>
                      <div className="music-header">
                        <span className="span-order">{musicLink.order}ª</span>
                        <div className="span-music" style={{ width: '100%', display: "flex", justifyContent: 'space-between', padding: '0 6px' }}>
                          <span className="span-name">
                            {musicLink.name}
                          </span>
                          {musicLink.description?.trim() && (
                            <span>
                              <FaRegCommentDots
                                className="icon-description"
                                onClick={() => handleCardClick(musicLink.description!, musicLink.name)}
                              />
                            </span>
                          )}
                        </div>
                        {musicLink.cifra && (
                          <span className="span-cifra">{musicLink.cifra}</span>
                        )}

                        <motion.button
                          className="btns toggle-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleButtons(musicLink.id!)}
                          title={showButtons[musicLink.id!] ? "Ocultar botões" : "Mostrar botões"}
                        >
                          <FaEllipsisV size={14} />
                        </motion.button>
                      </div>

                       <AnimatePresence>
                        {showButtons[musicLink.id!] && (
                          <motion.div
                            className="menu-buttons"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {musicLink.link && (
                              <motion.button
                                className="btns youtube-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  openLinkVideo({ url: musicLink.link || "" })
                                }
                                title="Assistir vídeo"
                                >
                                <FaYoutube size={16} />
                              </motion.button>
                            )}

                            {musicLink.letter && (
                              <motion.button
                                className="btns letter-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  musicLink.letter &&
                                  window.open(musicLink.letter, "_blank")
                                }
                                title="Abrir letra"
                              >
                                <FaFileAlt size={16} />
                              </motion.button>
                            )}

                            {musicLink.spotify && (
                              <motion.button
                                className="btns spotify-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  musicLink.spotify &&
                                  window.open(musicLink.spotify, "_blank")
                                }
                                title="Abrir no Spotify"
                              >
                                <FaSpotify size={16} />
                              </motion.button>
                            )}

                            <motion.button
                              className="btns edit-btn"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditClick(index)}
                              title="Editar"
                            >
                              <FaEdit size={16} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="btns delete-icon"
                              onClick={() => handleDelete(musicLink.id!)}
                              title="Deletar música"
                            >
                              <img
                                style={{ width: "20px", height: "20px" }}
                                src={Delete}
                                alt="delete"
                              />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <motion.div
                  className="edit-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="edit-content">
                    <div className="input-container">
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
                      <input
                        type="text"
                        value={spotify}
                        onChange={(e) => setSpotify(e.target.value)}
                        placeholder="Link do Spotify"
                        onKeyDown={handleKeyPress}
                      />
                      <label
                        htmlFor="cifra"
                        style={{
                          width: "100%",
                          fontSize: "14px",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        Ordem da música
                      </label>
                      <input
                        type="text"
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                        placeholder="Ordem da música"
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
                            resize: 'none',
                          }}
                        />
                      </div>

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          onClick={handleCancelEdit}
                          style={{ backgroundColor: "#9e9e9e" }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveEdit}
                          style={{ backgroundColor: "#007BFF" }}
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedDescription && (
                <motion.div
                  className="description-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeModal}
                >
                  <motion.div
                    className="modal-content"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Informações da "<strong>{selectedDescription.name}</strong>"</h3>
                    <pre className="modal-text" style={{ color: '#000' }}>{selectedDescription.description}</pre>
                    <button onClick={closeModal} className="close-btn">Fechar</button>
                  </motion.div>
                </motion.div>
              )}

              {openVideo && currentVideo && (
                <ContainerVd onClick={handleVideoClick}>
                  <ContentVd>
                    {loading && (
                      <div className="loading-screen">
                        <img
                          src={Loading}
                          alt="Loading"
                          style={{ width: "150px" }}
                        />
                      </div>
                    )}

                    <iframe
                      width="560"
                      height="315"
                      src={currentVideo.url}
                      title="YouTube video player"
                      style={{
                        border: "none",
                        display: loading ? "none" : "block",
                      }}
                      onLoad={() => setLoading(false)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </ContentVd>
                </ContainerVd>
              )}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </ListContainer>
  );
};

export default MusicLinkList;
