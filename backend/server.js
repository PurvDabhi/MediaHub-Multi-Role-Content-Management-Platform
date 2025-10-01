require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('./models/User');
const Content = require('./models/Content');
const Media = require('./models/Media');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Serve static files with proper headers for video streaming
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi')) {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Type', 'video/mp4');
    }
  }
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediahub')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'writer' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ email, password, name, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Content routes
app.get('/api/content', authenticateToken, async (req, res) => {
  try {
    const content = await Content.find().populate('authorId', 'name email').sort({ updatedAt: -1 });
    res.json(content);
  } catch (error) {
    console.error('Fetch content error:', error);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

app.post('/api/content', authenticateToken, async (req, res) => {
  try {
    const { title, body, status = 'draft', publishDate, tags = [] } = req.body;

    const content = new Content({
      title,
      body,
      status,
      authorId: req.user.id,
      publishDate,
      tags
    });

    await content.save();
    await content.populate('authorId', 'name email');

    res.status(201).json(content);
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Error creating content' });
  }
});

app.put('/api/content/:id', authenticateToken, async (req, res) => {
  try {
    const { title, body, status, publishDate, tags } = req.body;
    
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { title, body, status, publishDate, tags },
      { new: true }
    ).populate('authorId', 'name email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Error updating content' });
  }
});

app.delete('/api/content/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Attempting to delete content with ID:', req.params.id);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid content ID format' });
    }
    
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      console.log('Content not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Content not found' });
    }

    // Only allow deletion if user is the author or has admin/editor role
    console.log('User ID:', req.user.id);
    console.log('Author ID:', content.authorId.toString());
    console.log('User role:', req.user.role);
    
    if (content.authorId.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ message: 'You can only delete your own content' });
    }

    await Content.findByIdAndDelete(req.params.id);
    console.log('Content deleted successfully:', req.params.id);
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Error deleting content' });
  }
});

// Media routes
const upload = multer({ dest: 'uploads/' });

app.get('/api/media', authenticateToken, async (req, res) => {
  try {
    const media = await Media.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    const mediaWithFullUrl = media.map(item => ({
      ...item.toObject(),
      url: `http://localhost:${PORT}${item.url}`
    }));
    res.json(mediaWithFullUrl);
  } catch (error) {
    console.error('Fetch media error:', error);
    res.status(500).json({ message: 'Error fetching media' });
  }
});

app.post('/api/media/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileType = req.file.mimetype.startsWith('image/') ? 'image' :
                     req.file.mimetype.startsWith('video/') ? 'video' : 'document';
    
    console.log('Uploaded file:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: fileType
    });
    
    const fileUrl = `/uploads/${req.file.filename}`;

    const media = new Media({
      name: req.file.originalname,
      url: fileUrl,
      type: fileType,
      size: req.file.size,
      uploadedBy: req.user.id
    });

    await media.save();
    await media.populate('uploadedBy', 'name email');

    res.status(201).json({
      ...media.toObject(),
      url: `http://localhost:${PORT}${fileUrl}`
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: 'Error uploading media' });
  }
});

// Users routes
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // Only admins can view users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Debug route to check content IDs
app.get('/api/debug/content', authenticateToken, async (req, res) => {
  try {
    const content = await Content.find().select('_id title authorId').populate('authorId', 'name');
    const debugInfo = content.map(item => ({
      mongoId: item._id.toString(),
      title: item.title,
      author: item.authorId?.name
    }));
    res.json(debugInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('  - GET  /api/test');
  console.log('  - POST /api/auth/register');
  console.log('  - POST /api/auth/login');
  console.log('  - GET  /api/content');
  console.log('  - POST /api/content');
  console.log('  - GET  /api/media');
  console.log('  - POST /api/media/upload');
});