// 1. Required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

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
    analysis: { style: 'casual', color: 'blue' },
    outfits: [
      { name: 'Blue Jeans', image: '', buyLink: '' },
      { name: 'White Sneakers', image: '', buyLink: '' }
    ]
  });
});

// 7. Root route for health check
app.get('/', (req, res) => {
  res.send('AI Fashion Stylist backend is running!');
});

// 8. Start server on dynamic port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
