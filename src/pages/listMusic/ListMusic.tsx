import React, { useEffect, useState } from "react";
import useAllMusicHistoryContext from "../../context/hooks/useAllMusicHistoryContext";
import Button from "../../components/buttons/Buttons";
import Loading from "../../assets/Loading.gif";
import { Container, ContainerVd, ContentVd, Input, ListContainer, Main } from "./ListMusicStyle";
import { FirestoreTimestamp } from "../../helpers/helpers";
import Header from "../../components/header/Header";
import EditLink from '../../assets/imgs/edit.png';
import Footer from "../../components/footer/Footer";

const ListMusic: React.FC = () => {
  const { musicLinks, getAllMusicLinks, currentPage, hasNextPage, hasPrevPage } = useAllMusicHistoryContext();
  const [openVideo, setOpenVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
    getAllMusicLinks({ page: 1, limit });
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

  const handleAddToSunday = (id: string) => {
      console.log("Adicionar na lista de domingo:", id);
    };

    const handleUpdate = (id: string) => {
      console.log("Atualizar música:", id);
    };

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
        <Header />

        <Main>
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
            <Button className='btn-write'>
              <img src={EditLink} alt="editLink" />
            </Button>
          </div>

          <div className="container">
            {!musicLinks.length && <p>Nenhuma música encontrada.</p>}

            {musicLinks.length > 0 && (
              <p>
                {searchTerm
                  ? `Resultados para "${searchTerm}": ${musicLinks.length}`
                  : `Mostrando ${musicLinks.length} músicas`}
              </p>
            )}
            {sortedMusicLinks.map((music) => (
              <div key={music.id} className="container-card-music">
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
                    <Button
                      style={{ backgroundColor: "#a371f7", color: "#fff" }}
                      onClick={() => handleOpenVideo(music.link!)}
                    >
                      Vídeo
                    </Button>
                  )}

                  <Button
                    style={{ backgroundColor: "#2f81f7", color: "#fff" }}
                    onClick={() => handleUpdate(music.id)}
                  >
                    Atualizar
                  </Button>

                  <Button
                    style={{ backgroundColor: "#3fb950", color: "#fff" }}
                    onClick={() => handleAddToSunday(music.id)}
                  >
                    Add para Domingo
                  </Button>
                </div>
              </div>
            ))}

          </div>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-around", marginTop: "50px", paddingBottom: "70px" }}>
            <Button 
              disabled={!hasPrevPage} 
              onClick={() => getAllMusicLinks({ page: currentPage - 1, limit })}
            >
              Anterior
            </Button>

            <span><strong>Página {currentPage}</strong></span>

            <Button 
              disabled={!hasNextPage}
              onClick={() => getAllMusicLinks({ page: currentPage + 1, limit })}
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
      </Main>
      <Footer/>
    </Container>
  );
};

export default ListMusic;
