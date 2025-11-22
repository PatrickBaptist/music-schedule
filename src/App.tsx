import React, { memo, useEffect } from 'react';
import { useServiceWorkerUpdate } from './context/hooks/useServiceWorkerUpdate';
import { toast } from 'sonner';
import styled from 'styled-components';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MainRoutes from './components/mainRoutes/mainRoutes';
import { useLocation } from 'react-router-dom';
import { useScroll } from './context/hooks/useScroll';
import { useUserPresence } from './context/hooks/useUserPresente';

const HeaderComponent = memo(Header);
const FooterComponent = memo(Footer);

const AppContainer = styled.div<{ $hideLayout: boolean }>`
  height: 100dvh;
  width: 100%;
  display: grid;
  grid-template-rows: ${props => props.$hideLayout ? '1fr' : '70px 1fr 90px'};
  overflow: hidden;
`;

const HeaderSection = styled.header`
  grid-row: 1;
  z-index: 9999;
  position: sticky;
  top: 0;
`;

const FooterSection = styled.footer`
  grid-row: 3;
  z-index: 9999;
  position: sticky;
  bottom: 0;
`;

const ContainerRoutes = styled.div<{ $hideLayout: boolean }>`
  grid-row: ${props => props.$hideLayout ? '1' : '2'};
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  height: 100%;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: #0e1e30ff;
    border-radius: 1em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #58a6ff;
    border-radius: 1em;
  }
`;

const App: React.FC = () => {
  const updateAvailable = useServiceWorkerUpdate();
  const location = useLocation();
  const { routesRef, scrollToTop } = useScroll();

  useUserPresence();

  const handleUpdate = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (updateAvailable) {
      toast("Nova versão disponível!", {
        action: {
          label: "Atualizar",
          onClick: handleUpdate,
        },
        duration: 100000,
        richColors: true,
        position: "bottom-center",
        id: "update-toast",
      });
    }
  }, [updateAvailable]);

  useEffect(() => {
    scrollToTop();
  }, [location.pathname, scrollToTop]);

  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <AppContainer $hideLayout={hideLayout}>
      {!hideLayout && (
        <HeaderSection>
          <HeaderComponent />
        </HeaderSection>
      )}

      <ContainerRoutes 
        ref={routesRef} 
        $hideLayout={hideLayout}
      >
        <MainRoutes />
      </ContainerRoutes>

      {!hideLayout && (
        <FooterSection>
          <FooterComponent />
        </FooterSection>
      )}
    </AppContainer>
  );
};

export default App;