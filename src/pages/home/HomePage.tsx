import React, { useEffect, useState } from 'react';
import MusicLinkInput from '../../components/musicLink/MusicLinkInput';
import MusicLinkList from '../../components/musicList/MusicLinkList';
import { Container, ContainerHome } from './HomePageStyle';
import EditLink from '../../assets/imgs/edit.png';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import Button from '../../components/buttons/Buttons';
import LoadingScreen from '../../components/loading/LoadingScreen';
import PageWrapper from '../../components/pageWrapper/pageWrapper';
import Aviso from '../../components/warnings/warnings';
import SpecialSchedules from '../../components/specialSchedule/specialSchedule';
import useNotificationContext from '../../context/hooks/useNotificationContext';
import { SpecialSchedule } from '../../services/ScheduleService';
import ThursdaySchedule from '../../components/thursdaySchedule/thursday';
import BirthdaysThisMonth from '../../components/birthdaysMonth/birthdaysMonth';

const HomePage: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { nextSundaySchedule, specialSchedules, getSpecialSchedules } = useSchedulesContext();
  const { warning, getWarning } = useNotificationContext()
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getWarning(), getSpecialSchedules()]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getWarning, getSpecialSchedules]);

  return (
    <Container>
 
        <ContainerHome>
          <PageWrapper>
            {warning?.text && <Aviso message={"⚠️ " + warning.text} duration={20000} />}

            <div className="desktop-layout">
              <div className="coluna-1">
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
              </div>

              <div className="coluna-2">
                <div className='container-escala'>
                  <h4>Escala do próximo domingo</h4>
                  <div className='content'>
                  {isLoading ? (
                      <LoadingScreen />
                  ) : nextSundaySchedule ? (
                    <div className='content-escala'>
                      <p><strong>Vocal: </strong>{nextSundaySchedule.músicos.vocal1 || 'Não definido'}</p>
                      <p><strong>Teclas: </strong>{nextSundaySchedule.músicos.teclas || 'Não definido'}</p>
                      <p><strong>Violão: </strong>{nextSundaySchedule.músicos.violao || 'Não definido'}</p>
                      <p><strong>Batera: </strong>{nextSundaySchedule.músicos.batera || 'Não definido'}</p>
                      <p><strong>Bass: </strong>{nextSundaySchedule.músicos.bass || 'Não definido'}</p>
                      <p><strong>Guita: </strong>{nextSundaySchedule.músicos.guita || 'Não definido'}</p>
                    </div>
                  ) : (
                    <p>Não há escala disponível</p>
                  )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="desktop-layout-row-2">
              <div className="coluna-1">
                  {specialSchedules && <SpecialSchedules schedules={specialSchedules as SpecialSchedule[]} loading={isLoading} />}
              </div>
              <div className="coluna-2">
                  <div className='container-escala'>
                    <h4>Escala de Quinta-Feira</h4>
                    <div className='content'>
                      <div className='content-escala' style={{ backgroundColor: 'transparent' }}>
                        <ThursdaySchedule />
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            
            <BirthdaysThisMonth />

          </PageWrapper> 
        </ContainerHome>

    </Container>
  );
};

export default HomePage;