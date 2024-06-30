const crypto = require('crypto');
const { AuthenticationError } = require("apollo-server-express");
const { User, Transaction } = require("../models");
const nodemailer = require('nodemailer');
const { signToken } = require("../utils/auth");


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'capstoneg07@gmail.com',
    pass: 'erib azbz zifl iwec',
  },
});


const sendVerificationEmail = (email, token) => {
  const url = `http://localhost:3000/verify-email/${token}`;
  transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    html: `Please click this link to verify your email: <a href="${url}">${url}</a>`,
  });
};


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
      try {
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const user = await User.create({ username, email, password, verificationToken });
        sendVerificationEmail(user.email, verificationToken);
        return { message: 'Signup successful! Please check your email for verification.' };
      } catch (err) {
        console.error('Error creating user:', err);
        if (err.code === 11000) {
          const field = Object.keys(err.keyPattern)[0];
          if (field === 'email') {
            throw new AuthenticationError('Email already used. Please try another one.');
          } else if (field === 'username') {
            throw new AuthenticationError('Username already used. Please try another one.');
          }
        }
        throw new Error('An error occurred while creating the user.');
      }
    },
    // login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      if (!user.isVerified) {
        throw new AuthenticationError("Your email is not verified. Please check your inbox.");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    verifyEmail: async (parent, { token }) => {
      try {
        const user = await User.findOne({ verificationToken: token });
    
        if (!user) {
          throw new AuthenticationError("Invalid or expired token");
        }
    
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
    
        return "Email verified successfully!";
      } catch (err) {
        console.error('Error verifying email:', err);
        throw new Error('Error verifying email');
      }
    }
    
    
     
     
    
    // add a transaction
  
    // delete a transaction
    
  }
};

module.exports = resolvers;
