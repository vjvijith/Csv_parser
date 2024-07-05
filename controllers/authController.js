// controllers/auth.js

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      user = new User({ name: username, email, password });
      await user.save();
      console.log('User Created:', user);
  
      res.json(user);
    } catch (err) {
      console.error('Register Error:', err.message);
      res.status(500).send('Server Error');
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ msg: 'Invalid Credentials' });
      }
  
      console.log('Login Password:', password);
      console.log('Stored Hashed Password:', user.password);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        return res.status(401).json({ msg: 'Invalid Credentials' });
      }
  
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
      console.log('Generated Token:', token);
      res.json({ token });
    } catch (err) {
      console.error('Login Error:', err.message);
      res.status(500).send('Server Error');
    }
  };
  
module.exports = {
  register,
  login
};
