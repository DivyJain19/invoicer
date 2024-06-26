const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already Exists');
  } else {
    const user = await User.create({
      name,
      email,
      password,
      userId: crypto.randomBytes(16).toString('hex'),
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Error Occoured');
    }
  }
});

exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid Email or Password!');
  }
});
