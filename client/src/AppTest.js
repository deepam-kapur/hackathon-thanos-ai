import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Results from './components/Results';
import Footer from './components/Footer';
import ExampleQuestions from './components/ExampleQuestions';
import Chatbot from './components/Chatbot';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  color: #333;
`;

const FixedHeader = styled(Header)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

const FixedFooter = styled(Footer)`
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px; /* Height of the header */
  margin-bottom: 60px; /* Height of the footer */
  overflow-y: auto;
  padding: 20px;
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: green;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const App = () => {
  const [results, setResults] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSearch = (query) => {
    if (query === "How to change Owner of a Question") {
      setResults(["Streaming data..."]);
      setIsStreaming(true);
    } else {
      setResults(prevResults => [...prevResults, `Result for "${query}" with more data to show`]);
    }
  };

  const handleRemove = (index) => {
    setResults(prevResults => prevResults.filter((_, i) => i !== index));
    if (index === 0) {
      setIsStreaming(false);
    }
  };

  const streamData = () => {
    setResults(prevResults => {
      const newData = `${prevResults[0]} More streaming data...`;
      return [newData, ...prevResults.slice(1)];
    });
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <AppWrapper>
      <FixedHeader />
      <ContentWrapper>
        <SearchBar onSearch={handleSearch} />
        <ExampleQuestions />
        <Results results={results} onRemove={handleRemove} isStreaming={isStreaming} streamData={streamData} />
      </ContentWrapper>
      <FixedFooter />
      {isChatbotOpen && <Chatbot onClose={toggleChatbot} />}
      <ChatbotButton onClick={toggleChatbot}>
        {isChatbotOpen ? '-' : 'Chat'}
      </ChatbotButton>
    </AppWrapper>
  );
};

export default App;
