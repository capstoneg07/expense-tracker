import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth'; // Ensure this path is correct for your project
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../styles/Profile.css'; // Ensure this path is correct
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../utils/mutations'; // Ensure this path is correct

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formState, setFormState] = useState({ email: '', username: '' });
  const [updateUser, { error }] = useMutation(UPDATE_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
    },
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const isLoggedIn = Auth.loggedIn();
    if (isLoggedIn) {
      const profile = Auth.getProfile();
      setUserInfo(profile);
      setFormState({ email: profile.data.email, username: profile.data.username });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await updateUser({
        variables: { ...formState },
      });
      setUserInfo(data.updateUser);
      setAlertMessage('Profile updated successfully!');
      setShowAlert(true);
    } catch (e) {
      console.error(e);
      setAlertMessage('An error occurred while updating your profile.');
      setShowAlert(true);
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="profile-container">
      <Row className="justify-content-md-center mt-5">
        <Col md="8">
          <div className="profile-header text-center mb-4">
            <h1>Profile Page</h1>
          </div>
          {showAlert && (
            <Alert variant={alertMessage.includes('successfully') ? 'success' : 'danger'} onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          )}
          <div className="profile-details">
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={formState.username}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="update-button">
                Update
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
