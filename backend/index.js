// 1. Required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
<<<<<<< HEAD

// 2. Setup app and port
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Create uploads folder if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 4. Enable CORS
app.use(cors());

// 5. Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// 6. Upload endpoint with dummy response
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
=======
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
>>>>>>> 6ee4cfdbb19c0ab09d94b553d7776c87355103df
    analysis: { style: 'casual', color: 'blue' },
    outfits: [
      { name: 'Blue Jeans', image: '', buyLink: '' },
      { name: 'White Sneakers', image: '', buyLink: '' }
    ]
  });
});

<<<<<<< HEAD
// 7. Root route for health check
app.get('/', (req, res) => {
  res.send('AI Fashion Stylist backend is running!');
});

// 8. Start server on dynamic port
=======
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
>>>>>>> 6ee4cfdbb19c0ab09d94b553d7776c87355103df
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
