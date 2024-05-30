import React from 'react';
import styled from 'styled-components';

const ExampleQuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem auto;
  width: 80%;
  max-width: 1200px;
`;

const Heading = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const QuestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
`;

const QuestionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const QuestionText = styled.div`
  color: black;
  font-size: 1rem;
`;

const ExampleQuestions = () => {
  const questions = [
    "How to change Owner of a Question",
    "How to Duplicate a Question to the test",
    "How to add remove tags from multiple questions using scripts",
    "How to see Library ID of a question",
    "How to import questions in bulk",
    "How to create a custom question template"
  ];

  return (
    <ExampleQuestionsWrapper>
      <Heading>Example Questions</Heading>
      <QuestionsGrid>
        {questions.map((question, index) => (
          <QuestionCard key={index}>
            <QuestionText>{question}</QuestionText>
          </QuestionCard>
        ))}
      </QuestionsGrid>
    </ExampleQuestionsWrapper>
  );
};

export default ExampleQuestions;
