import React, { memo, useEffect, useRef } from 'react';
import { useServiceWorkerUpdate } from './context/hooks/useServiceWorkerUpdate';
import { toast } from 'sonner';
import styled from 'styled-components';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MainRoutes from './components/mainRoutes/mainRoutes';
import { useLocation } from 'react-router-dom';

const HeaderComponent = memo(Header);
const FooterComponent = memo(Footer);

const AppContainer = styled.div`
  height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
`;

const FixedHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 9999;
`;

const FixedFooter = styled.footer`
  position: sticky;
  bottom: 0;
  z-index: 9999;
`;

const ConainterRoutes = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

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
  const routesRef = useRef<HTMLDivElement>(null);

  const handleUpdate = () => {
    window.location.reload(); // recarrega para pegar nova versão
  };

  useEffect(() => {
    if (updateAvailable) {
      toast("Nova versão disponível!", {
        action: {
          label: "Atualizar",
          onClick: handleUpdate,
        },
        duration: 10000,
        richColors: true,
        position: "bottom-center",
        id: "update-toast",
      });
    }
  }, [updateAvailable]);

  useEffect(() => {
    if (routesRef.current) {
      routesRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <AppContainer>
      {!hideLayout && (
        <FixedHeader>
          <HeaderComponent />
        </FixedHeader>
      )}

      <ConainterRoutes ref={routesRef}>
        <MainRoutes />
      </ConainterRoutes>

      {!hideLayout && (
        <FixedFooter>
          <FooterComponent />
        </FixedFooter>
      )}
    </AppContainer>
  );
};

export default App;