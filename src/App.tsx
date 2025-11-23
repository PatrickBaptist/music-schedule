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
  overflow: hidden;
`;

const FixedHeader = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 9999;
`;

const FixedFooter = styled.footer`
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 9999;
`;

const ContainerRoutes = styled.div<{ $hideLayout: boolean }>`
  height: ${({ $hideLayout }) => $hideLayout ? '100dvh' : 'calc(100dvh - 150px)'};
  width: 100%;
  position: fixed;
  top: ${({ $hideLayout }) => $hideLayout ? '0' : '70px'};
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

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
        <FixedHeader>
          <HeaderComponent />
        </FixedHeader>
      )}

      <ContainerRoutes 
        ref={routesRef} 
        $hideLayout={hideLayout}
      >
        <MainRoutes />
      </ContainerRoutes>

      {!hideLayout && (
        <FixedFooter>
          <FooterComponent />
        </FixedFooter>
      )}
    </AppContainer>
  );
};

export default App;