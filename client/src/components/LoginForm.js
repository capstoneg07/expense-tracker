import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import { Link,useNavigate } from 'react-router-dom';

import Auth from '../utils/auth';
import { FORGOT_PASSWORD } from '../utils/mutations';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [login] = useMutation(LOGIN_USER);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({ variables: { ...userFormData } });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  // const handleForgotPassword = async () => {
  //   try {
  //     await forgotPassword({ variables: { email: userFormData.email } });
  //     alert('Password reset email sent');
  //   } catch (err) {
  //     console.error(err);
  //     setShowAlert(true);
  //   }
  // };
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email (you can use 'bill@gmail.com' to test drive with pre-loaded data)</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password (you can use 'password' to test drive with pre-loaded data)</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <div className="form-footer">
          <Button
            disabled={!(userFormData.email && userFormData.password)}
            type='submit'
            className='login-signup-button'>
            Submit
          </Button>
          <Button
            onClick={handleForgotPassword}
            className='forgot-password-button'>
            Forgot Password?
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
