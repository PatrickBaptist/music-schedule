import { motion } from "framer-motion";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
