import React from "react";
import { motion } from "framer-motion";
import useServerContext from "../../context/hooks/useWakeUpContext";
import { BarraContent, Container, ContainerLogo, Content } from "./wakeUpLoaderStyle";
import Logo from '../../assets/imgs/logo.png'

const WakeUpScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isReady, progress } = useServerContext();

    if (!isReady) {
        return (
        <Container>
            <Content>
                <ContainerLogo>
                    <img src={Logo} alt="Logo da igreja" className="logo" />
                </ContainerLogo>
                
                <BarraContent>
                <motion.div
                    animate={{ width: `${progress}%` }}
                    style={{ height: "100%", backgroundColor: "#2EBEF2" }}
                    />
                </BarraContent>
            </Content>
        </Container>
        );
    }

  return <>{children}</>;
};

export default WakeUpScreen;