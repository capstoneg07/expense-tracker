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
    <div className="forgot-password-container">
      <h1 className="forgot-password-title">Forgot Password</h1>
      <Form onSubmit={handleFormSubmit} className="forgot-password-form">
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
            className="form-control"
          />
        </Form.Group>
        <Button type='submit' className='forgot-password-button'>Send Reset Link</Button>
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

        .forgot-password-container {
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

        .forgot-password-title {
          color: var(--primary-color);
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .forgot-password-form .form-group {
          margin-bottom: 1.5rem;
        }

        .forgot-password-form .form-control {
          border-radius: var(--border-radius);
          padding: 0.75rem;
          border: 1px solid var(--primary-color);
        }

        .forgot-password-form .form-label {
          font-weight: bold;
          color: var(--text-color);
        }

        .forgot-password-button {
          background-color: var(--button-bg);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
        }

        .forgot-password-button:hover {
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
          .forgot-password-container {
            padding: 1rem;
          }

          .forgot-password-title {
            font-size: 2rem;
          }

          .forgot-password-form .form-control {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
