require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const username = 'alexmanning';
    const newPassword = 'cosmicsharK1357!';

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();
    console.log('Password reset successful');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetPassword(); 