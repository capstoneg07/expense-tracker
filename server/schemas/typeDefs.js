const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    transactions: [Transaction]
    isVerified: Boolean!
  }
  type Transaction {
    _id: ID
    date: String
    amount: Float
    highLevelCategory: String
    category: String
    description: String
  }
  type Auth {
    token: ID
    user: User
  }
  type Query {
    me: User
    transactions: [Transaction]
  }
  type Mutation {
    addUser(username: String, email: String, password: String): Auth
    login(email: String, password: String): Auth
    addTransaction(
      date: String!
      amount: Float!
      highLevelCategory: String!
      category: String!
      description: String!
    ) : Transaction
    deleteTransaction(transactionId: ID!): Transaction
    updateTransaction(
      transactionId: ID!
      date: String
      amount: Float
      highLevelCategory: String
      category: String
      description: String
    ): Transaction
    verifyEmail(token: String!): String
    updateUser(email: String!, username: String!): User
    forgotPassword(email: String!): String
    resetPassword(token: String!, newPassword: String!): Auth
  }
`;

module.exports = typeDefs;