const { AuthenticationError } = require("apollo-server-express");
const { User, Transaction } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // me: User
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate('transactions');
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    transactions: async (parent, args) => {
      
     
      return await Transaction.find({}).populate('username').sort({ date: 'desc' });

      
    
    },
  },
  Mutation: {
    // addUser
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // login
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    // add a transaction
  
    // delete a transaction
    
  }
};

module.exports = resolvers;
