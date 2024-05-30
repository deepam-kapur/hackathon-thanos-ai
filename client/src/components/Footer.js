import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: black;
  color: white;
  padding: 1rem;
  text-align: center;
  width: 100%;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <p>&copy; 2024 Thanos AI</p>
    </FooterWrapper>
  );
};

export default Footer;
