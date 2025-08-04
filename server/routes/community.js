const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Community = require('../models/Community');
const User = require('../models/User');

// @route   POST api/community
// @desc    Create a new community
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if community with the same name already exists
    let community = await Community.findOne({ name });
    if (community) {
      return res.status(400).json({ msg: 'A community with this name already exists.' });
    }

    const newCommunity = new Community({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id], // Creator is the first member
    });

    community = await newCommunity.save();
    res.json(community);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/community
// @desc    Get all communities
// @access  Public
router.get('/', async (req, res) => {
    try {
        const communities = await Community.find().populate('creator', ['name']).sort({ date: -1 });
        res.json(communities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/community/join/:id
// @desc    Join a community
// @access  Private
router.put('/join/:id', auth, async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        // Check if the community exists
        if (!community) {
            return res.status(404).json({ msg: 'Community not found' });
        }

        // Check if the user is already a member
        if (community.members.some(member => member.equals(req.user.id))) {
            return res.status(400).json({ msg: 'You are already a member of this community' });
        }

        community.members.push(req.user.id);
        await community.save();

        res.json(community.members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
