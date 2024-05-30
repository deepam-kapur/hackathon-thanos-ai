import React, { useState } from "react";
import styled from "styled-components";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import Footer from "./components/Footer";
import ExampleQuestions from "./components/ExampleQuestions";
import Chatbot from "./components/Chatbot";
import Loader from "./components/Loader";

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

const Temp = () => {
  const [data,setData] = useState([]);
  const [results, setResults] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setisLoading] = useState(false);
  const handleSearch = async (query) => {
    setisLoading(true);
    // setResults(["Streaming data..."]);
    setIsStreaming(true);
      // if data is not null, pass the thread to the api call..
      // else, pass the query to the api call
    try {
      const response = await fetch("http://192.168.3.189:9000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId: data?.threadId, question: query }),
      });
      const res = await response.json();
      console.log(res);
      setData(res);
      const { data: responseData, files } = res.response;

      const formattedResults = [
        <React.Fragment key="main">
          <div
            dangerouslySetInnerHTML={{
              __html: responseData.replaceAll("<a ", '<a target="_blank" '),
            }}
          />
        </React.Fragment>,
      ];

      if (files && files.length > 0) {
        formattedResults.push(
          <React.Fragment key="references">
            <div>More references:</div>
            {files.map((file) => (
              <div key={file.url}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.title}
                </a>
              </div>
            ))}
          </React.Fragment>
        );
      }

      setResults(formattedResults);
      setIsStreaming(false);
      setisLoading(false);
    } catch (error) {
      setResults([`Error: ${error.message}`]);
      setIsStreaming(false);
      setisLoading(false);
    }
  };

  const handleRemove = (index) => {
    setResults((prevResults) => prevResults.filter((_, i) => i !== index));
    if (index === 0) {
      setIsStreaming(false);
    }
  };

  const streamData = () => {
    setResults((prevResults) => {
      const newData = "";
      return [newData, ...prevResults.slice(1)];
    });
  };

  // setisLoading(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <AppWrapper>
      <FixedHeader />
      <ContentWrapper>
        <SearchBar onSearch={handleSearch} />
        {/* <ExampleQuestions /> */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <Results
              results={results}
              onRemove={handleRemove}
              isStreaming={isStreaming}
              streamData={streamData}
            />
          </>
        )}
      </ContentWrapper>

      <FixedFooter />
      {isChatbotOpen && <Chatbot onClose={toggleChatbot} />}
      {/* <ChatbotButton onClick={toggleChatbot}>
        {isChatbotOpen ? "-" : "Chat"}
      </ChatbotButton> */}
    </AppWrapper>
  );
};

export default Temp;
