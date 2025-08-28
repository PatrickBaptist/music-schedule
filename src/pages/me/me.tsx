import React from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import PageWrapper from '../../components/pageWrapper/pageWrapper';

const MePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between', alignItems: 'center' }}>
      <Header />
        <PageWrapper>
            <h1>Em manutenção..</h1>
        </PageWrapper>
      <Footer />
    </div>
  );
};

export default MePage;