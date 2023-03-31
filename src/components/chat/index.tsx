import { useRef, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import styles from "./chat.module.css";

interface IChatProps {
  socket: Socket | null;
}

interface IMessage {
  text: string;
  authorId: string;
  author: string | "";
  messageId: string
}

export function Chat({ socket }: IChatProps) {
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    socket?.on("received_message", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    return () => {
      socket?.off("received_message");
    };
  }, [socket]);

  const handleClearInput = () => {
    if (messageRef.current) {
      messageRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    const message = messageRef.current?.value;
    if (!message?.trim()) {
      return;
    }

    socket?.emit("message", message);
    handleClearInput();
  };

  const handleIsSender = (authorId: String) => {
    return socket?.id === authorId
      ? styles.cardMessageSender
      : styles.cardMessageRecipient;
  };

  return (
    <div className={styles.container}>
      <h1>Chat</h1>
      <div className={styles.listMessages}>
        {messageList.map((message) => (
          <div
            key={message.messageId}
            className={`${styles.cardMessage} ${handleIsSender(message.authorId)}`}
            style={{alignSelf: `${socket?.id === message.authorId ? 'flex-start' : 'flex-end'}`}}
          >
            <p>
              {message.author}: {message.text}
            </p>
          </div>
        ))}
      </div>
      <div className={styles.inputSendMessage}>
        <textarea ref={messageRef}></textarea>
        <button className="btn" onClick={handleSubmit}>
          Enviar
        </button>
      </div>
    </div>
  );
}
