import React, { useState } from 'react';
import MusicLinkInput from '../components/MusicLinkInput';
import MusicLinkList from '../components/MusicLinkList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, ContainerHome } from './pageStyle/HomePage';
import EditLink from '../assets/imgs/edit.png'
import useSchedulesContext from '../context/hooks/useScheduleContext';
import Button from '../components/Buttons';

const HomePage: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { nextSundaySchedule } = useSchedulesContext();

  return (
    <Container>
      <Header>Escala</Header>
      <ContainerHome>

        <div className='content-louvores'>
          <h4>Adicionar louvor</h4>
          <Button className='btn-write' onClick={() => setIsModalOpen(true)}>
              <img src={EditLink} alt="editLink" />
          </Button>
        </div>

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <MusicLinkInput setIsModalOpen={setIsModalOpen}/>
              </div>
            </div>
          )}

        <MusicLinkList />

        <div className='container-escala'>
          <h4>Escala do próximo domingo</h4>
          <div className='content'>
          {nextSundaySchedule ? (
            <div className='content-escala'>
              <p><strong>Vocal:</strong> {nextSundaySchedule.músicos.vocal1}</p>
              <p><strong>Vocal:</strong> {nextSundaySchedule.músicos.vocal2}</p>
              <p><strong>Teclas:</strong> {nextSundaySchedule.músicos.teclas}</p>
              <p><strong>Violão:</strong> {nextSundaySchedule.músicos.violao}</p>
              <p><strong>Batera:</strong> {nextSundaySchedule.músicos.batera}</p>
              <p><strong>Bass:</strong> {nextSundaySchedule.músicos.bass}</p>
              <p><strong>Guita:</strong> {nextSundaySchedule.músicos.guita}</p>
            </div>
          ) : (
            <p>Não há escala disponível</p>
          )}
          </div>
        </div>
      </ContainerHome>
      <Footer />
    </Container>
  );
};

export default HomePage;