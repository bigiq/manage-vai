const express = require('express');
const multer = require('multer');
const path = require('path');
const Verification = require('../models/Verification');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Submit verification request
router.post('/submit', auth, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CV file' });
    }

    // Check if user already has a pending request
    const existingRequest = await Verification.findOne({
      user: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending verification request' });
    }

    const verification = new Verification({
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      cvPath: req.file.path
    });

    await verification.save();

    res.status(201).json({ 
      message: 'Verification request submitted successfully',
      verification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all verification requests (admin only)
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const requests = await Verification.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve verification request (admin only)
router.post('/approve/:id', adminAuth, async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    // Update verification status
    verification.status = 'approved';
    await verification.save();

    // Update user verification status
    await User.findByIdAndUpdate(verification.user, { isVerified: true });

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete verification request (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    await Verification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Verification request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's verification status
router.get('/status', auth, async (req, res) => {
  try {
    const verification = await Verification.findOne({ 
      user: req.user.id 
    }).sort({ createdAt: -1 });

    res.json({
      isVerified: req.user.isVerified,
      hasRequest: !!verification,
      requestStatus: verification?.status || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
