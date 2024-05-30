import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ResultsWrapper = styled.div`
  margin: 2rem auto;
  width: 60%;
  max-width: 800px;
`;

const ResultItem = styled.div`
  background: white;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  max-height: 1000px; /* Adjust based on your preference */
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #d9534f;
  cursor: pointer;
  font-size: 1.2rem;
`;

const Results = ({ results, onRemove, isStreaming, streamData }) => {
  const streamingRef = useRef();

  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        streamData();
        if (streamingRef.current) {
          streamingRef.current.scrollTop = streamingRef.current.scrollHeight;
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isStreaming, streamData]);

  return (
    <ResultsWrapper>
      {results.map((result, index) => (
        <ResultItem key={index} ref={index === 0 ? streamingRef : null}>
          {/* <RemoveButton onClick={() => onRemove(index)}>
            <FontAwesomeIcon icon={faTimes} />
          </RemoveButton> */}
          {result}
        </ResultItem>
      ))}
    </ResultsWrapper>
  );
};

export default Results;
