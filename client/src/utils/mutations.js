import { gql } from "@apollo/client";
import { useParams } from 'react-router-dom';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation addTransaction(
    $date: String!
    $amount: Float!
    $highLevelCategory: String!
    $category: String!
    $description: String!
  ) {
    addTransaction(
      date: $date
      amount: $amount
      highLevelCategory: $highLevelCategory
      category: $category
      description: $description
    ) {
      _id
      amount
      category
      date
      description
      highLevelCategory
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($username: String!, $email: String!, $password: String!) {
    deleteUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: ID!) {
    deleteTransaction(transactionId: $transactionId) {
      _id
      amount
      description
    }
  }
`;
export const VERIFY_EMAIL = gql`
  mutation verifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;


export const UPDATE_USER = gql`
  mutation updateUser($email: String!, $username: String!) {
    updateUser(email: $email, username: $username) {
      _id
      email
      username
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;