import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  background-color: #4a90e2;
  .navbar-brand,
  .nav-link {
    color: #fff !important;
    font-weight: bold;
  }
  .nav-link:hover {
    color: #50e3c2 !important;
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: #fff;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .modal-header {
    background-color: #4a90e2;
    border-bottom: none;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  .modal-title {
    color: #fff;
    font-size: 1.5rem;
  }
  .nav-pills .nav-link {
    background-color: #e0e0e0;
    color: #333;
    margin: 0 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease-in-out;
  }
  .nav-pills .nav-link.active {
    background-color: #50e3c2;
    color: #333;
  }
  .modal-body {
    background-color: #f4f6f8;
    padding: 2rem;
  }
`;

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const isLoggedIn = Auth.loggedIn();
    console.log("User logged in: ", isLoggedIn);

    if (isLoggedIn) {
      const profile = Auth.getProfile();
      console.log("User profile: ", profile);
      setUserInfo(profile);
    }
  }, []);

  console.log("This is User info: ", userInfo);

  return (
    <>
      <StyledNavbar collapseOnSelect variant='dark' expand='lg'>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            Expense Tracker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar'>
            <Nav className='ml-auto'>
              <Nav.Link eventKey="1" as={Link} to='/'>
                Home
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link eventKey="2" as={Link} to='/transactions'>
                    Transactions
                  </Nav.Link>
                  <Nav.Link eventKey="3" as={Link} to='/analysis'>
                    Analysis
                  </Nav.Link>
                  {userInfo && userInfo.data && (
                    <Nav.Link eventKey="6" as={Link} to='/profile'>
                      {`Hello, ${userInfo.data.username}`}
                    </Nav.Link>
                  )}
                  <Nav.Link eventKey="4" onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link eventKey="5" onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>
      <StyledModal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </StyledModal>
    </>
  );
};

export default AppNavbar;
