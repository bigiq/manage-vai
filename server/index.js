const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Manage VAI API is running...');
});

app.use('/api/auth', authRoutes);

// ADD THIS LINE
app.use('/api/posts', require('./routes/posts'));

// ADD THIS LINE
app.use('/api/community', require('./routes/community'));



// --- Server Listening ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
