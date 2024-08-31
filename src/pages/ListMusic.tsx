import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContainerMusic = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #cde8ff;
  box-sizing: border-box;
  overflow: hidden;

  h1 {
    margin-top: 100px;
  }
`

const ContentMusic = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;

    div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;

        span {
            width: 500px;
            height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto;
            background-color: #b6d8f7;

            ul {
                width: 80%;
                display: flex;
                align-items: center;
                list-style: none;
                margin: 10px 0;
                padding: 0;
            }

            &::-webkit-scrollbar {
                width: 10px;
                background-color: #fff;
                border-radius: 1em;
            }

            &::-webkit-scrollbar-button {
                display: none;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #7fc3ff;
                border-radius: 1em;
            }

            @media (max-width: 1005px) {
                width: 400px;
            }

            @media (max-width: 1005px) {
                width: 300px;
            }

            @media (max-width: 670px) {
                width: 100%;
                height: 250px;
            }

            @media (max-width: 400px) {
                width: 100%;
                height: 150px;
            }
        }
    }

    @media (max-width: 670px) {
        flex-direction: column;
    }
`

const listCelebration = [
    {song: "Mil graus"},
    {song: "Chegada do Leão - Marquinhos Gomes"},
    {song: "Comunhão - Kleber Lukas"},
    {song: "Crente que ora - Eli Soares"},
    {song: "Deus é bom"},
    {song: "Deus não está morto - Fernandinho"},
    {song: "Em nome de Jesus"},
    {song: "Nosso Deus - Kuka"},
    {song: "Eu navegarei - Shekinah Worship"},
    {song: "Eu vou seguir com fé - NT Praise"},
    {song: "Filho do Deus vivo - Fernandinho"},
    {song: "Galileu - Fernandinho"},
    {song: "Luz do mundo - Fernandinho"},
    {song: "Grande é o Senhor"},
    {song: "Mais - Kemuel"},
    {song: "Marca da promessa"},
    {song: "Mil cairão"},
    {song: "Não valeria"},
    {song: "O nosso general - Musicos essências"},
    {song: "Os anjos te louvam - Eli Soares"},
    {song: "Pedra na mão"},
    {song: "Porque Ele vive"},
    {song: "Seu amor não falha - Nívea Soares"},
    {song: "Seu sangue"},
    {song: "Toda sorte de benção"},
    {song: "Tremenda graça - Fred Atrás"},
    {song: "Tudo que tem fôlego / Eu vejo a glória"},
    {song: "Vim falar com Deus"},
    {song: "Vou te alegrar"}
]

const listWorship = [
    { song: "Tu és - Fhop" },
    { song: "Senhor e Rei - Trazendo a arca" },
    { song: "Aclame ao Senhor - Rebeca Carvalho" },
    { song: "Jesus filho de Deus - Fernandinho" },
    { song: "Atos 2 / Ele exaltado - Gabriel Guedes" },
    { song: "Aviva-nos / Como Nunca Antes - Isadora Pompeo" },
    { song: "Boa parte - Fhop" },
    { song: "Caminho no deserto" },
    { song: "Creio que tu és a cura" },
    { song: "De nada tenho falta" },
    { song: "É tudo sobre você" },
    { song: "Ele exaltado" },
    { song: "Ele vem - Gabriel Guedes" },
    { song: "Espero por ti" },
    { song: "Eu era órfão" },
    { song: "Eu me rendo - Ministério Mergulhar" },
    { song: "Eu vou construir - Juliano Son" },
    { song: "Isaías 9" },
    { song: "Jesus Filho de Deus" },
    { song: "Liberta me de mim" },
    { song: "Lugar secreto" },
    { song: "Maranata - Ministério aviva" },
    { song: "Meu amanhã será melhor que hoje" },
    { song: "Nada além de ti" },
    { song: "Não pare" },
    { song: "Nunca foi sobre nós" },
    { song: "O seu amor por mim - Wesley Santos" },
    { song: "Oceanos" },
    { song: "Oh quão lindo esse nome é" },
    { song: "Ousado amor" },
    { song: "Pai nosso" },
    { song: "Para onde iremos nós" },
    { song: "Pra onde eu irei - Morada" },
    { song: "Pra sempre" },
    { song: "Quando Ele vem" },
    { song: "Quero conhecer Jesus" },
    { song: "Rei do Meu coração – Be one Music" },
    { song: "Rendido estou – Aline Barros e Fernandinho" },
    { song: "Santo - Juliano Son" },
    { song: "Só quero ver você" },
    { song: "Só Tu és santo" },
    { song: "Tem tudo a ver com Ele" },
    { song: "Teu reino" },
    { song: "Toda via me alegrarei" },
    { song: "Vitorioso És - Gabriel Guedes" },
    { song: "Volte a sonhar" }
];


const ListMusic: React.FC = () => {

  return (
      
      <ContainerMusic>
        <Header>Escala</Header>

        <h1>Sugestões de músicas</h1>

        <ContentMusic>
            <div>
                <h2>Celebração</h2>
                <span>
                {listCelebration.map((celebration, index) => (
                    <ul key={index}>
                        <li>{celebration.song}</li>  
                    </ul>
                ))}
                </span>
            </div>

            <div>
                <h2>Adoração</h2>
                <span>
                {listWorship.map((worship, index) => (
                    <ul key={index}>
                        <li>{worship.song}</li>  
                    </ul>
                ))}
                </span>
            </div>

        </ContentMusic>

            <Footer />
    </ContainerMusic>
  );
};

export default ListMusic;