import React, { useState, useEffect } from 'react';
import { getFirestore, onSnapshot, doc } from 'firebase/firestore';

const Notification = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const db = getFirestore();
    const docRef = doc(db, 'notifications', 'current');

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data?.text) {
          setMessage(data.text);
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
          }, 60000);
        }
      } else {
        console.log('No such document!');
      }
    });

    return () => unsubscribe();
  }, []);

  if (!visible) return null;

  return (
    <div style={styles.notification}>
      <p>{message}</p>
      <button onClick={() => setVisible(false)} style={styles.closeButton}>Fechar</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  notification: {
    position: 'fixed',
    top: '100px',
    right: '10px',
    backgroundColor: '#4eacff',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    zIndex: '2024'
  },
  closeButton: {
    background: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
    padding: '5px 10px',
  },
};

export default Notification;