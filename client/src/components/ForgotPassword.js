import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await forgotPassword({ variables: { email } });
      navigate(`/reset-password/${email}`);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Error sending reset email. Please try again.
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter your email'
            name='email'
            onChange={handleInputChange}
            value={email}
            required
          />
        </Form.Group>
        <Button type='submit'>Send Reset Link</Button>
      </Form>
    </>
  );
};

export default ForgotPassword;
