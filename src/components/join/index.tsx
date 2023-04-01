import { FormEvent, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import styles from './join.module.css';

interface IJoinProps {
  setChatVisibility: () => void;
  setSocket: (socket: Socket) => void;
}

export function Join({ setChatVisibility, setSocket }: IJoinProps) {
  const userNameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userName = userNameRef.current?.value;

    if (!userName?.trim()) {
      return;
    }

    const socket = await io('https://chat-realtime-server.onrender.com');
    socket.emit('set_username', userName);
    setSocket(socket);
    setChatVisibility();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type='text' ref={userNameRef} placeholder='Nome de usuário' />
          <button type='submit' className='btn'>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
