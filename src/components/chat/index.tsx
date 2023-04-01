import { useRef, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import styles from './chat.module.css';
import { PaperPlaneRight } from '@phosphor-icons/react';

interface IChatProps {
  socket: Socket | null;
}

interface IMessage {
  text: string;
  authorId: string;
  author: string | '';
  messageId: string;
}

export function Chat({ socket }: IChatProps) {
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    socket?.on('received_message', (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    return () => {
      socket?.off('received_message');
    };
  }, [socket]);

  useEffect(() => {
    messageRef.current?.addEventListener('keyup', handleAutoResizeTextArea);

    return () =>
      messageRef.current?.removeEventListener(
        'keyup',
        handleAutoResizeTextArea
      );
  }, []);

  const handleAutoResizeTextArea = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    target.style.height = '54px';

    if (target.scrollHeight > 54) {
      target.style.height = `${target.scrollHeight}px`;
      return;
    }
  };

  const handleClearInput = () => {
    if (messageRef.current) {
      messageRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    const message = messageRef.current?.value;
    if (!message?.trim()) {
      return;
    }

    socket?.emit('message', message);
    handleClearInput();
    messageRef.current?.focus();
  };

  const handleIsSender = (authorId: String) => {
    return socket?.id === authorId
      ? styles.cardMessageSender
      : styles.cardMessageRecipient;
  };

  return (
    <div className={styles.container}>
      <div className={styles.listMessagesWrapper}>
        <div className={styles.listMessages}>
          {messageList.map((message) => (
            <div
              key={message.messageId}
              className={`${styles.cardMessage} ${handleIsSender(
                message.authorId
              )}`}
            >
              <p>
                {message.author}: {message.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.inputSendMessage}>
        <textarea ref={messageRef}></textarea>
        <PaperPlaneRight
          className={styles.sendButton}
          size={32}
          weight='fill'
          onClick={handleSubmit}
          color='#fff'
        />
      </div>
    </div>
  );
}
