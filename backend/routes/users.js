const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('community', 'name email isVerified');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's rent history
router.get('/rent-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('rentHistory');
    res.json(user.rentHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get community users
router.get('/community', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('community', 'name email isVerified');
    
    res.json(user.community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove user from community
router.delete('/community/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.community = user.community.filter(
      communityUserId => communityUserId.toString() !== req.params.userId
    );
    
    await user.save();
    res.json({ message: 'User removed from community' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
