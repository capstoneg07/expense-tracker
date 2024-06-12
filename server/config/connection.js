const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expensetracker', {
  mongoose.connect('mongodb+srv://capstoneg07:capstone123@cluster0.bjcqfoh.mongodb.net/',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;