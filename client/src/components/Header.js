import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background: black;
  color: white;
  padding: 1rem;
  text-align: center;
  width: 100%;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <h1>Thanos AI </h1>
    </HeaderWrapper>
  );
};

export default Header;
