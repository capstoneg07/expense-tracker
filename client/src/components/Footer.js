import React from 'react';
import '../styles/Home.css';
import styled from 'styled-components';

const FooterContainer = styled.div`
  background-color: #4a90e2;
  color: #fff;
  padding: 2rem 1rem;
  text-align: center;
`;

const SocialIcons = styled.div`
  margin-bottom: 1rem;

  a {
    color: #fff;
    margin: 0 1rem;
    transition: color 0.3s;

    &:hover {
      color: #50e3c2;
    }

    i {
      font-size: 2rem;
    }
  }
`;

const ContactInfo = styled.p`
  margin: 0;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const FooterText = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  margin-top: 1rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <SocialIcons>
              <a href="https://www.facebook.com">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.twitter.com">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com">
                <i className="fab fa-instagram"></i>
              </a>
            </SocialIcons>
          </div>
          <div className="col-md-4">
            <ContactInfo>Contact us: capstone07@gmail.com</ContactInfo>
          </div>
        </div>
        <FooterText>
          &copy; 2024. Created by Apexa, Dharmgna, Moinuddin, Femy, Hrithik Lal
        </FooterText>
      </div>
    </FooterContainer>
  );
};

export default Footer;
