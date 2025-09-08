const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ isAvailable: true })
      .populate('owner', 'name isVerified')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts by title (for search/compare)
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Title query parameter is required' });
    }

    const posts = await Post.find({
      title: { $regex: title, $options: 'i' },
      isAvailable: true
    }).populate('owner', 'name isVerified');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts from community users
router.get('/community', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('community');
    const communityUserIds = user.community.map(u => u._id);
    
    const posts = await Post.find({
      owner: { $in: communityUserIds },
      isAvailable: true
    }).populate('owner', 'name isVerified').sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new post
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('bedroomCount').isInt({ min: 1 }).withMessage('Bedroom count must be at least 1'),
  body('bathroomCount').isInt({ min: 1 }).withMessage('Bathroom count must be at least 1'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('mobileNumber').trim().notEmpty().withMessage('Mobile number is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, bedroomCount, bathroomCount, location, mobileNumber, price } = req.body;

    const post = new Post({
      title,
      bedroomCount,
      bathroomCount,
      location,
      mobileNumber,
      price,
      owner: req.user.id,
      ownerName: req.user.name
    });

    await post.save();
    await post.populate('owner', 'name isVerified');

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm rent (user)
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.isAvailable) {
      return res.status(400).json({ message: 'Post is no longer available' });
    }

    // Add to user's rent history
    const user = await User.findById(req.user.id);
    user.rentHistory.push({
      postId: post._id,
      title: post.title,
      location: post.location,
      price: post.price
    });

    // Mark post as unavailable
    post.isAvailable = false;

    await user.save();
    await post.save();

    res.json({ message: 'Rent confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add post owner to community
router.post('/:id/add-to-community', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('owner');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already in community
    if (user.community.includes(post.owner._id)) {
      return res.status(400).json({ message: 'User already in community' });
    }

    // Add to community
    user.community.push(post.owner._id);
    await user.save();

    res.json({ message: 'User added to community successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
