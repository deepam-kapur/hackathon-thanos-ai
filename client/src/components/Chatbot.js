import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ChatbotWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  max-width: 90%;
  background: #1c1c1c;
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ChatbotHeader = styled.div`
  background: green;
  color: white;
  padding: 0.5rem 1rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatbotBody = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
`;

const ChatbotInputWrapper = styled.div`
  padding: 0.5rem;
  border-top: 1px solid #333;
`;

const ChatbotInput = styled.input`
  width: calc(100% - 50px);
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  margin-right: 5px;
`;

const ChatbotSendButton = styled.button`
  background: green;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, fromUser: true }]);
      setInput('');
      // Simulate a bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `Bot response to "${input}"`, fromUser: false }]);
      }, 1000);
    }
  };

  return (
    <ChatbotWrapper>
      <ChatbotHeader>
        <div>Chatbot</div>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </ChatbotHeader>
      <ChatbotBody>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.fromUser ? 'right' : 'left' }}>
            <p>{message.text}</p>
          </div>
        ))}
      </ChatbotBody>
      <ChatbotInputWrapper>
        <ChatbotInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <ChatbotSendButton onClick={handleSend}>Send</ChatbotSendButton>
      </ChatbotInputWrapper>
    </ChatbotWrapper>
  );
};

export default Chatbot;
