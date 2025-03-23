const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('Starting database reset script...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Import models
const User = require('../models/User');
const Todo = require('../models/Todo');
const Link = require('../models/Link');

const resetDatabase = async () => {
  try {
    // Connect to the database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Delete all data from collections
    console.log('Deleting all users...');
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users`);
    
    console.log('Deleting all todos...');
    const todoResult = await Todo.deleteMany({});
    console.log(`Deleted ${todoResult.deletedCount} todos`);
    
    console.log('Deleting all links...');
    const linkResult = await Link.deleteMany({});
    console.log(`Deleted ${linkResult.deletedCount} links`);

    console.log('All data has been deleted successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    // Close the database connection
    console.log('Closing database connection...');
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run the reset function
resetDatabase(); 