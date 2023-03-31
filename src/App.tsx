import { useState } from "react";
import { Socket } from "socket.io-client";
import { Chat } from "./components/chat";
import { Join } from "./components/join";

function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleSetChatVisibility = () => {
    setChatVisibility(true);
  };

  const handleSetSocket = (socket: Socket) => {
    setSocket(socket);
  };

  return (
    <div className="App">
      {chatVisibility ? (
        <Chat socket={socket} />
      ) : (
        <Join setSocket={handleSetSocket} setChatVisibility={handleSetChatVisibility} />
      )}
    </div>
  );
}

export default App;
