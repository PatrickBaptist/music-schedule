import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useServerContext from "../../context/hooks/useWakeUpContext";
import {
  BarraContent,
  Container,
  ContainerLogo,
  Content,
} from "./wakeUpLoaderStyle";
import Logo from "../../assets/imgs/logo.png";

const WakeUpScreen: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isReady, progress } = useServerContext();

  return (
    <AnimatePresence mode="wait">
      {!isReady ? (
        <Container
          key="loading"
          as={motion.div}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        >
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
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WakeUpScreen;
