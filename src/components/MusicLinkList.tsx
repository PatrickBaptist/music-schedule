import React from 'react';
import { useMusicContext } from '../context/hooks/useMusicContext';
import styled from 'styled-components';
import Button from './Buttons';

const ListContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  font-size: 16px;
  padding: 0 10px;
  box-sizing: border-box;

    .container-list {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;

      @media(max-width: 900px) {
        width: 100%;
      }

      li {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
      }
    }

    button {
      cursor: pointer;
      margin: 2px;
    }
`

const MusicLinkList: React.FC = () => {
  const { musicLinks, removeMusicLink } = useMusicContext();

  const goToYoutube = (link: string): void => {
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  return (
    <ListContainer>
      {musicLinks.map((musicLink, index) => (
        <div key={index} className='container-list'>

          <li>
          {musicLink.name}
          </li>

          <div>
            <Button onClick={() => goToYoutube(musicLink.link)}>Ir Youtube</Button>
            <Button onClick={() => removeMusicLink(index)}>x</Button>
          </div>

        </div>
      ))}
    </ListContainer>
  );
};

export default MusicLinkList;