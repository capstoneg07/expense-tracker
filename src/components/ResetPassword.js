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
    <div className="reset-password-container">
      <h1 className="reset-password-title">Reset Password</h1>
      <Form onSubmit={handleFormSubmit} className="reset-password-form">
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
            className="form-control"
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
            className="form-control"
          />
        </Form.Group>

        <Button type='submit' className='reset-password-button'>Reset Password</Button>
      </Form>
      <footer className="footer">
        <div className="footer-content">
          &copy; 2024. Created by Apexa, Dharmgna, Moinuddin, Femy, Hrithik Lal
        </div>
      </footer>
      <style jsx>{`
        :root {
          --primary-color: #4a90e2;
          --secondary-color: #50e3c2;
          --background-color: #f4f6f8;
          --text-color: #333;
          --button-bg: #4a90e2;
          --button-hover-bg: #357ab7;
          --border-radius: 8px;
          --footer-bg: #4a90e2;
          --footer-text-color: #fff;
        }

        .reset-password-container {
          background-color: var(--background-color);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 3rem auto;
          text-align: center;
          position: relative;
          min-height: 100vh;
        }

        .reset-password-title {
          color: var(--primary-color);
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .reset-password-form .form-group {
          margin-bottom: 1.5rem;
        }

        .reset-password-form .form-control {
          border-radius: var(--border-radius);
          padding: 0.75rem;
          border: 1px solid var(--primary-color);
        }

        .reset-password-form .form-label {
          font-weight: bold;
          color: var(--text-color);
        }

        .reset-password-button {
          background-color: var(--button-bg);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
        }

        .reset-password-button:hover {
          background-color: var(--button-hover-bg);
        }

        .footer {
          background-color: var(--footer-bg);
          color: var(--footer-text-color);
          padding: 1rem;
          position: fixed;
          bottom: 0;
          width: 100%;
          text-align: center;
          left: 0;
        }

        .footer-content {
          margin: 0;
        }

        .alert {
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .reset-password-container {
            padding: 1rem;
          }

          .reset-password-title {
            font-size: 2rem;
          }

          .reset-password-form .form-control {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
