import React, {useState} from 'react';
import { useMusicLinksContext } from '../context/hooks/useMusicLinksContext';
import Button from './Buttons';
import AddLink from '../assets/imgs/add_link.png'
import Delete from '../assets/imgs/delete.png'
import { ContainerVd, ContentVd, ListContainer } from '../components/styles/MusicLinkList'

type Video = {
  url: string
}

const MusicLinkList: React.FC = () => {
  const { musicLinks, removeMusicLink } = useMusicLinksContext();
  const [ openVideo, setOpenVideo ] = useState(false)
  const [ currentVideo, setCurrentVideo ] = useState<Video | null>(null);

  const handleVideoClick = () => {
    setOpenVideo(false)
  }
  
  const openLinkVideo = (videoUrl: Video) => {
    setCurrentVideo(videoUrl);
    setOpenVideo(true);
  };

  /*const goToYoutube = (link: string): void => {
    window.open(link, '_blank', 'noopener,noreferrer');
  }*/

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
    };
    
  return (
    <ListContainer>
      {musicLinks.map((musicLink, index) => (
        <div key={index} className='container-list'>

          <li>
          {musicLink.name}
          </li>

          <div className='container-btn'>
            <Button onClick={() => openLinkVideo({ url: musicLink.link })}>
              <img src={AddLink} alt="addLink" />
            </Button>
            <Button onClick={() => removeMusicLink(index)}>
              <img src={Delete} alt="delete" />
            </Button>
          </div>

          {openVideo && currentVideo && (
            <ContainerVd onClick={handleVideoClick}>
                <ContentVd>
                  <iframe 
                    width="560"
                    height="315" 
                    src={convertToEmbedUrl(currentVideo.url)}
                    title="YouTube video player" 
                    style={{ border: 'none' }}
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