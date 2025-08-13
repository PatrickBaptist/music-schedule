import React, { useState} from 'react';
import { useMusicLinksContext } from '../../context/hooks/useMusicLinksContext';
import Button from '../buttons/Buttons';
import Loading from '../../assets/Loading.gif'
import Delete from '../../assets/imgs/delete.png'
import { ContainerVd, ContentVd, ListContainer, SelectContainer } from './MusicLinkListStyle'

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

    await removeMusicLink(id);

    setLoadingCards(prev => ({ ...prev, [id]: false }));
  };
  
    const handleSaveEdit = async () => {
      if (editIndex) {
        setLoadingCards(prev => ({ ...prev, [editIndex]: true }));
        const updatedLink = { name, link, letter, cifra, order };
        setIsEditing(false);
        setEditIndex(null);

        await updateMusicLink(editIndex, updatedLink);

        setLoadingCards(prev => ({ ...prev, [editIndex]: false }));
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
      {musicLinks.map((musicLink, index) => (
        <div key={index} className='container-list'>

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
                      <Button
                        onClick={() => openLinkVideo({ url: musicLink.link || '' })}
                        style={{ backgroundColor: '#a371f7', color: 'white' }}
                      >
                        Vídeo
                      </Button>              
                  )}
                  
                  {musicLink.letter && (
                      <Button 
                        style={{ backgroundColor: '#3fb950', color: 'white' }}
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
                        style={{ backgroundColor: '#2f81f7', color: 'white' }}
                        onClick={() => handleEditClick(index)}
                      >
                        Editar
                      </Button>
                    </>
                </div>
              </div>

              <div>
                {musicLink.cifra && <span className='span-cifra'>{musicLink.cifra}</span>}
              </div>

              </>
              )}
            </div>
            <Button
              className='delete-icon'
              onClick={() => {
                handleDelete(musicLink.id!)
              }}
              style={{ backgroundColor: '#C0392B', width: '10px', height: '40px', borderRadius: 'none', border: 'none' }}
              >
              <img style={{ width: '20px', height: '20px' }} src={Delete} alt="delete"/>
            </Button>
          </div>

          {isEditing && (
            <div className="edit-form">
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

                  <Button onClick={handleSaveEdit} style={{ backgroundColor: '#007BFF' }}>
                    Salvar
                  </Button>
                  <Button onClick={handleCancelEdit} style={{ backgroundColor: '#9e9e9e' }}>
                    Cancelar
                  </Button>
                  <Button
                    className='delete-icon-edit'
                    onClick={() => {
                      removeMusicLink(musicLink.id!)
                    }}
                    style={{ backgroundColor: '#C0392B', width: '10px', height: '40px', borderRadius: 'none', border: 'none' }}
                    >
                    <img style={{ width: '20px', height: '20px' }} src={Delete} alt="delete"/>
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

        </div>
      ))}
    </ListContainer>
  );
};

export default MusicLinkList;