import "./style.css";
import io from "socket.io-client";
import { useState } from "react";
import ChatApp from "./ChatApp";


const socket = io.connect("https://chat-application-mbvq.onrender.com/");


function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinChat = () => {
    if (username !== "") {
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join Chat</h3>
          <input type="text"
            placeholder="Enter ur Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <button onClick={joinChat}>Join Chat</button>
        </div>
      ) : (
        <ChatApp socket={socket} username={username} />
      )}
    </div>
  );
}

export default App;
