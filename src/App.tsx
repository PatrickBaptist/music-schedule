import React, { memo, useEffect } from 'react';
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
  display: flex;
  flex-direction: column;
  height: 100dvh;
`;

const ConainterRoutes = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;

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

  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <AppContainer>
      {!hideLayout && <HeaderComponent />}

      <ConainterRoutes>
        <MainRoutes />
      </ConainterRoutes>

      {!hideLayout && <FooterComponent />}
    </AppContainer>
  );
};

export default App;