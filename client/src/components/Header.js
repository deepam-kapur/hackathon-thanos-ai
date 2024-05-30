import React from 'react';
import styled from 'styled-components';
import logo from '../hr-logo.svg';
const HeaderWrapper = styled.header`
  background: black;
  color: white;
  padding: 1rem;
  text-align: center;
  width: 100%;
`;

const Header = () => {
  return (
    <HeaderWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <img src={logo} style={{ marginRight: '1rem', marginLeft:'50px' }}/>
      <h1 style={{ margin: '0 auto' }}>Thanos AI</h1>
    </HeaderWrapper>
  );
};

export default Header;
