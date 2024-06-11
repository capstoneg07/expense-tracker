const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expensetracker', {
  mongoose.connect('mongodb+srv://dharmgnajoshi131199:Dharmgna13@driving-test-data-db.zo7i3bj.mongodb.net/ExpensetrackerSchema',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;