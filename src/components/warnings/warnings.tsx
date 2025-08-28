import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AvisoProps {
  message: string;
  duration?: number;
}

const Aviso: React.FC<AvisoProps> = ({ message, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          style={{
            width: "100%",
            padding: "15px 0",
            backgroundColor: "#f39c12",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            borderRadius: "0 0 8px 8px",
            marginBottom: "20px",
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Aviso;
