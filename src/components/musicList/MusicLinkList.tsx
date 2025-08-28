import React, { useState} from 'react';
import useMusicLinksContext from '../../context/hooks/useMusicLinksContext';
import Button from '../buttons/Buttons';
import Loading from '../../assets/Loading.gif'
import Delete from '../../assets/imgs/delete.png'
import { ContainerVd, ContentVd, ListContainer, SelectContainer } from './MusicLinkListStyle'
import { toast } from 'sonner';
import { AnimatePresence, motion } from "framer-motion";

type Video = {
  url: string
}

const MusicLinkList: React.FC = () => {

  const tons = [
    'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em',
    'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am',
    'A#', 'A#m', 'B', 'Bm'
  ];

  const { musicLinks, removeMusicLink, updateMusicLink } = useMusicLinksContext();
  const [ openVideo, setOpenVideo ] = useState(false)
  const [ currentVideo, setCurrentVideo ] = useState<Video | null>(null)
  const [ loading, setLoading ] = useState(false)
  const [ loadingCards, setLoadingCards ] = useState<{ [key: string]: boolean }>({});
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const [ editIndex, setEditIndex ] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [letter, setLetter] = useState('');
  const [cifra, setCifra] = useState('');
  const [order, setOrder] = useState(0);

  const handleVideoClick = () => {
    setOpenVideo(false)
    setLoading(false)
  }
  
  const openLinkVideo = (videoUrl: Video) => {
    setCurrentVideo(videoUrl);
    setLoading(true);
    setOpenVideo(true);
  }

    const handleEditClick = (index: number) => {
      const musicLink = musicLinks[index];

        setName(musicLink.name);
        setLink(musicLink.link || '');
        setLetter(musicLink.letter || '');
        setCifra(musicLink.cifra || '');
        setOrder(musicLink.order || 0);
        setEditIndex(musicLink.id!);
        setIsEditing(true);

    };

  const handleDelete = async (id: string) => {
    setLoadingCards(prev => ({ ...prev, [id]: true }));
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
      setLoadingCards(prev => ({ ...prev, [id]: false }));
    }

  };
  
  const handleSaveEdit = async () => {
    if (editIndex) {
      setLoadingCards(prev => ({ ...prev, [editIndex]: true }));
      const updatedLink = { name, link, letter, cifra, order };
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveEdit();
      }
    }
    
  return (
    <ListContainer>
      <AnimatePresence>
      {musicLinks.map((musicLink, index) => (
        <motion.div
            key={index}
            className='container-list'
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }} // card some para a esquerda
            transition={{ duration: 0.4 }}
          >

          <div className='container-card'>
            <div className='card'>

              {loadingCards[musicLink.id!] ? (
                
                  <p style={{ color: '#fff' }}>
                    Aguarde..
                  </p>
                
              ) : (
              <>
              
              <span className='span-order'>{musicLink.order}</span>
              
              <div className='music-btns'>

                <span className='span-music'>{musicLink.name}</span>

                <div className='menu-buttons'>
                  {musicLink.link && (
                    <motion.button
                      className='btns'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openLinkVideo({ url: musicLink.link || '' })}
                      style={{ backgroundColor: '#a371f7', color: 'white' }}
                    >Vídeo</motion.button>              
                  )}
                  
                  {musicLink.letter && (
                    <motion.button
                      className='btns'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ backgroundColor: '#3fb950', color: 'white' }}
                      onClick={() => musicLink.letter && window.open(musicLink.letter, '_blank')}
                    >Letra</motion.button>
                  )}
                    <>
                      <motion.button
                        className='btns'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ backgroundColor: '#2f81f7', color: 'white' }}
                        onClick={() => handleEditClick(index)}
                      >Edit</motion.button>
                    </>
                </div>
              </div>

              <div>
                {musicLink.cifra && <span className='span-cifra'>{musicLink.cifra}</span>}
              </div>

              </>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className='btns'
              onClick={() => handleDelete(musicLink.id!)}
              style={{ backgroundColor: '#C0392B', width: '10px', height: '40px', border: 'none' }}
            >
              <img style={{ width: '20px', height: '20px' }} src={Delete} alt="delete"/>
            </motion.button>
          </div>

          {isEditing && (
            <motion.div
                className="edit-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
              <div className='edit-content'>
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
                  <label htmlFor="cifra" style={{ width: '100%', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>Ordem da música</label>
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

                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleCancelEdit} style={{ backgroundColor: '#9e9e9e' }}>
                      Cancelar
                    </Button>
                    <Button className='delete-icon-edit' onClick={() => { handleDelete(musicLink.id!)}} style={{ backgroundColor: '#C0392B' }}>
                      <img style={{ width: '20px', height: '20px' }} src={Delete} alt="delete"/>
                    </Button>
                    <Button onClick={handleSaveEdit} style={{ backgroundColor: '#007BFF' }}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {openVideo && currentVideo && (
            <ContainerVd onClick={handleVideoClick}>
                <ContentVd>

                {loading && 
                  <div className="loading-screen">
                    <img src={Loading} alt="Loading" style={{width: '150px'}}/>
                  </div>
                }

                  <iframe 
                    width="560"
                    height="315" 
                    src={(currentVideo.url)}
                    title="YouTube video player" 
                    style={{ border: 'none', display: loading ? 'none' : 'block' }}
                    onLoad={() => setLoading(false)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen 
                    />
                </ContentVd>
            </ContainerVd>
          )}

        </motion.div>
      ))}
      </AnimatePresence>
    </ListContainer>
  );
};

export default MusicLinkList;