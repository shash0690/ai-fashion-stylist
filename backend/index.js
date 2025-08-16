// 1. Required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 2. Setup app and dynamic port
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Enable CORS for all origins (for frontend connections)
app.use(cors());

// 4. Make uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 5. Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 7. Health/root routes
app.get('/', (req, res) => {
  res.send('AI Fashion Stylist backend is running!');
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// 8. Upload endpoint with dummy AI response (safe for Render demo/testing)
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully (dummy response)',
    filePath: `https://ai-fashion-stylist.onrender.com/uploads/${req.file.filename}`,
    analysis: { style: 'casual', color: 'blue' },
    outfits: [
      {
        name: 'Blue Jeans',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?fit=crop&w=400&q=80',
        buyLink: 'https://example.com/blue-jeans'
      },
      {
        name: 'White Sneakers',
        image: 'https://images.unsplash.com/photo-1513267048330-cb2ee57bfb34?fit=crop&w=400&q=80',
        buyLink: 'https://example.com/white-sneakers'
      }
    ]
  });
});

// 9. Dummy recommend endpoint
app.post('/recommend', express.json(), (req, res) => {
  // Dummy logic, use your own if needed
  res.json({
    suggestions: [
      { name: 'Floral Dress', match: 0.94 },
      { name: 'Denim Jacket', match: 0.87 }
    ]
  });
});

// 10. Start server on dynamic port for Render
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
