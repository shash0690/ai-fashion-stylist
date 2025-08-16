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

// 8. Upload endpoint with multiple unique outfits
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
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=crop&w=400&q=80',
        buyLink: 'https://www.amazon.in/dp/B07BJKRR25/?tag=shash0690-21'
      },
      {
        name: 'White Sneakers',
        image: 'https://images.unsplash.com/photo-1513267048330-cb2ee57bfb34?fit=crop&w=400&q=80',
        buyLink: 'https://www.amazon.in/dp/B098DRT5Q4/?tag=shash0690-21'
      },
      {
        name: 'Black T-Shirt',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?fit=crop&w=400&q=80',
        buyLink: 'https://www.amazon.in/dp/B07C65XFBB/?tag=shash0690-21'
      },
      {
        name: 'Amazon Fashion Store',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?fit=crop&w=400&q=80',
        buyLink: 'https://www.amazon.in?&linkCode=ll2&tag=shash0690-21&linkId=5607bdebd0af466fdf41efec24f77c68&language=en_IN&ref_=as_li_ss_tl'
      }
    ]
  });
});

// 9. Dummy recommend endpoint
app.post('/recommend', express.json(), (req, res) => {
  res.json({
    suggestions: [
      { name: 'Floral Dress', match: 0.94 },
      { name: 'Denim Jacket
