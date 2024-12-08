const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

// User Registration
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
      phoneNumber
    });

    await user.save();

    // Generate authentication token
    const token = generateToken(user);

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by username
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        message: 'Authentication failed. User not found.' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account is inactive' 
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Authentication failed. Invalid password.' 
      });
    }

    // Generate authentication token
    const token = generateToken(user);

    res.json({ 
      message: 'Login successful', 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving profile', 
      error: error.message 
    });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Update failed', 
      error: error.message 
    });
  }
};

// Manage User Status (for Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId, 
      { isActive }, 
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Status update failed', 
      error: error.message 
    });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find(  { role: 'Driver' } );
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving drivers', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find( {role: 'Customer'});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
}