const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HousePost = require('../models/HousePost');

// Note: We are not handling file uploads here yet.
// We will add multer for image handling in a future step.

// @route   POST api/posts
// @desc    Create a house rent post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, address, city, rent, bedrooms, bathrooms } = req.body;

  try {
    const newPost = new HousePost({
      user: req.user.id,
      title,
      description,
      address,
      city,
      rent,
      bedrooms,
      bathrooms,
      // images will be handled later
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
