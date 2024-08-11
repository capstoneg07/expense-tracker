const crypto = require('crypto');
const { AuthenticationError } = require("apollo-server-express");
const { User, Transaction } = require("../models");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const { signToken } = require("../utils/auth");


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'capstoneg07@gmail.com',
    pass: 'erib azbz zifl iwec',
  },
});


const sendVerificationEmail = (email, token) => {
  const url = `https://expense-tracker-frontend-lq96.onrender.com/verify-email/${token}`;
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
    },

    

    updateUser: async (parent, { email, username }, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { email, username },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
     



    //Forgot password 
    forgotPassword: async (parent, { email }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

      await user.save();

      const resetUrl = `https://expense-tracker-frontend-lq96.onrender.com/#/reset-password/${resetToken}`;

      transporter.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `You requested a password reset. Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
      });

      return "Password reset email sent";
    },
    resetPassword: async (parent, { token, newPassword }) => {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AuthenticationError("Password reset token is invalid or has expired");
      }

      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      const authToken = signToken(user);

      return { token: authToken, user };
    },

    // add a transaction
    addTransaction: async (parent, { date, amount, highLevelCategory, category, description }, context) => {
      try {
        if (context.user) {
          console.log('trying to add transaction!')
          console.log(context.user.username);
          const transaction = await Transaction.create(
            {
              date,
              amount,
              highLevelCategory,
              category,
              description,
            }
          );

          console.log("transaction", transaction);
          console.log("context.user._id", context.user._id);

          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { transactions: transaction._id } }
          );
          console.log(transaction);
          console.log(user);
          return transaction;

        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.log(err);
        throw new AuthenticationError(err);
      }
    },

    // delete a transaction
    deleteTransaction: async (parent, { transactionId }, context) => {
      if (context.user) {
        const transaction = await Transaction.findOneAndDelete({
          _id: transactionId,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { transactions: transaction._id } }
        );

        return transaction;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    updateTransaction: async (parent, { transactionId, date, amount, highLevelCategory, category, description }, context) => {
      if (context.user) {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          transactionId,
          { date, amount, highLevelCategory, category, description },
          { new: true }
        );

        return updatedTransaction;
      }
      throw new AuthenticationError("You need to be logged in!");
    }
  }
};

module.exports = resolvers;
