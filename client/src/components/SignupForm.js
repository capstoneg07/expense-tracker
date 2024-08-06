import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ADD_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';
// import Auth from '../utils/auth';

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();
  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData }
      });

      if (!data) {
        throw new Error('something went wrong!');
      }
      setInfoMessage('Sign up successful! Please check your email for verification.');

      setUserFormData({
        username: '',
        email: '',
        password: '',
      });
    } catch (err) {
      console.error(err);
      if (err.message.includes("Username already used")) {
        setAlertMessage("Username already used. Please try another one.");
      } else if (err.message.includes("Email already used")) {
        setAlertMessage("Email already used. Please try another one.");
      } else {
        setAlertMessage("Something went wrong with your signup!");
      }
      setShowAlert(true);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit} className="signup-form">
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          {alertMessage}
        </Alert>
        {infoMessage && (
          <Alert variant='success'>
            {infoMessage}
          </Alert>
        )}
        <Form.Group>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
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
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'
          className='signup-button'>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default SignupForm;
