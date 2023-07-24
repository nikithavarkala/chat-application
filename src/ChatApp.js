import React, { useEffect, useState, useRef } from "react";
import "./App.css"; 

function ChatApp({ socket, username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messageList]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src="https://img.freepik.com/free-icon/user_318-875902.jpg" className="profile"/>
        <p>Chat</p>
      </div>
      <div className="chat-body" ref={chatContainerRef} >
        {messageList.map((messageContent, index) => (
          <div
            className="message"
            key={index}
            id={username === messageContent.author ? "you" : "other"}
          >
            <div>
              <div className="message-content">
                <p>{messageContent.message}</p>
              </div>
              <div className="message-meta">
                <p id="time">{messageContent.time}</p>
                <p id="author">{messageContent.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage} >
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGFUksm-k0Ygn78tewg-esfG0RIjAJDL7spA&usqp=CAU" className="send_button"/>
            {/* <img src="https://play-lh.googleusercontent.com/9y0jXL87-Ic_0HokfSxQgu0HRCGt7b24Lgh3skEZvsDt8ySE7Ltcl0k57KVPMIjQ7g" className="send_button"/> */}
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
