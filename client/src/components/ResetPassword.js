import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '../utils/mutations';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const { token } = useParams();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setShowAlert(true);
      return;
    }

    try {
      await resetPassword({ variables: { token, newPassword: password } });
      alert('Password reset successfully. You can now log in with your new password.');
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Passwords do not match!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='password'>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter new password'
            name='password'
            onChange={handleInputChange}
            value={password}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='confirmPassword'>Confirm New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm new password'
            name='confirmPassword'
            onChange={handleInputChange}
            value={confirmPassword}
            required
          />
        </Form.Group>

        <Button type='submit'>Reset Password</Button>
      </Form>
    </>
  );
};

export default ResetPassword;
