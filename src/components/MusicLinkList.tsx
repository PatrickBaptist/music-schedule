import React, { useState} from 'react';
import { useMusicLinksContext } from '../context/hooks/useMusicLinksContext';
import Button from './Buttons';
import AddLink from '../assets/imgs/add_link.png'
import Delete from '../assets/imgs/delete.png'
import Loading from '../assets/Loading.gif'
import { ContainerVd, ContentVd, ListContainer, SelectContainer } from '../components/styles/MusicLinkList'

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
  const [loading, setLoading] = useState(false)
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [letter, setLetter] = useState('');
  const [cifra, setCifra] = useState('');

  const handleVideoClick = () => {
    setOpenVideo(false)
    setLoading(false)
  }
  
  const openLinkVideo = (videoUrl: Video) => {
    setCurrentVideo(videoUrl);
    setLoading(true);
    setOpenVideo(true);
  }  

    const convertToEmbedUrl = (url: string): string => {
      try {
        const parsedUrl = new URL(url);
        let videoId: string | null = null;
    
        // Verifica se a URL é do formato short do YouTube
        if (parsedUrl.hostname === 'youtu.be') {
          videoId = parsedUrl.pathname.substring(1); // Remove o '/'
        } else if (parsedUrl.hostname === 'www.youtube.com' && parsedUrl.searchParams.has('v')) {
          // Verifica se a URL é do formato completo do YouTube
          videoId = parsedUrl.searchParams.get('v');
        }
    
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        } else {
          console.error('ID do vídeo não encontrado na URL.');
          return '';
        }
      } catch (error) {
        console.error('Erro ao converter URL:', error);
        return '';
      }
    }

    const handleEditClick = (index: number) => {
      const musicLink = musicLinks[index];
      setName(musicLink.name);
      setLink(musicLink.link || '');
      setLetter(musicLink.letter || '');
      setCifra(musicLink.cifra || '');
      setEditIndex(index);
      setIsEditing(true);
      setActiveMenuIndex(null);
    };
  
    const handleSaveEdit = () => {
      if (editIndex !== null) {
        const updatedLink = { name, link, letter, cifra };
        updateMusicLink(editIndex, updatedLink);
        setIsEditing(false);
        setEditIndex(null);
      }
    };
  
    const handleCancelEdit = () => {
      setIsEditing(false);
    };
    
  return (
    <ListContainer>
      {musicLinks.map((musicLink, index) => (
        <div key={index} className='container-list'>

          {activeMenuIndex !== index && <span className='span-music'>{musicLink.name}</span>}
          {activeMenuIndex !== index && <span className='span-name'>{musicLink.cifra}</span>}

          <div className='container-btn'>

            {activeMenuIndex === index && (
              <div className='menu-buttons'>
                {musicLink.link && (
                    <Button
                      onClick={() => openLinkVideo({ url: musicLink.link || '' })}
                      style={{ backgroundColor: '#2EBEF2' }}
                    >
                      <img src={AddLink} alt="addLink" />
                    </Button>              
                )}
                
                {musicLink.letter && (
                    <Button 
                      style={{ backgroundColor: '#2ef248' }}
                      onClick={() => {
                        if (musicLink.letter) {
                          window.open(musicLink.letter, '_blank')
                        }
                      }}
                    >
                      Letra
                                           
                    </Button>
                )}
                  <>
                    <Button
                      style={{ backgroundColor: '#e6e6e6' }}
                      onClick={() => handleEditClick(index)}
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => {
                        removeMusicLink(index)
                        setActiveMenuIndex(null)
                      }}
                      style={{ backgroundColor: '#C0392B' }}
                    >
                      <img src={Delete} alt="delete" />
                    </Button>

                    <Button
                      aria-label="Fechar Menu"
                      onClick={() => setActiveMenuIndex(null)}
                      style={{ backgroundColor: '#007BFF' }}
                    >
                      X
                    </Button>
                  </>
                
              </div>
            )}

          {activeMenuIndex !== index && 
            <Button
            aria-label="Abrir menu"
            onClick={() => setActiveMenuIndex(index)}
            style={{ backgroundColor: '#007BFF' }}
            >
              Abrir menu
            </Button>
          }
          
          </div>

          {isEditing && editIndex === index && (
            <div className="edit-form">
              <div className='edit-content'>
                <div className="input-container">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da música"
                  />
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Link da música"
                  />
                  <input
                    type="text"
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    placeholder="Link da música"
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

                  <Button onClick={handleSaveEdit} style={{ backgroundColor: '#28a745' }}>
                    Salvar
                  </Button>
                  <Button onClick={handleCancelEdit} style={{ backgroundColor: '#ffc107' }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
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
                    src={convertToEmbedUrl(currentVideo.url)}
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

        </div>
      ))}
    </ListContainer>
  );
};

export default MusicLinkList;