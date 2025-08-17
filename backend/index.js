// 1. Required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const vision = require('@google-cloud/vision');
let fetch;
try {
  fetch = global.fetch ? global.fetch : require('node-fetch');
} catch (e) {
  fetch = require('node-fetch');
}
const cheerio = require('cheerio');

// 2. Setup app and dynamic port
const app = express();
const PORT = process.env.PORT || 5000;

// 3. CORS and JSON
app.use(cors());
app.use(express.json());

// 4. Make uploads directory if missing
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
const upload = multer({ storage });

// 7. Health/root routes
app.get('/', (req, res) => {
  res.send('AI Fashion Stylist backend is running!');
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// 8. IMAGE UPLOAD + GOOGLE VISION ANALYSIS ENDPOINT
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const client = new vision.ImageAnnotatorClient();
  try {
    const localImagePath = path.join(__dirname, 'uploads', req.file.filename);
    const [result] = await client.labelDetection(localImagePath);
    const labels = result.labelAnnotations.map(label => label.description);
    res.json({
      message: 'File analyzed successfully!',
      filePath: `/uploads/${req.file.filename}`,
      labels: labels,
      outfits: []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze image', details: err.message });
  }
});

// 9. AMAZON PRODUCT RECOMMENDATION ENDPOINT (with DUMMY PRODUCTS fallback)
app.post("/search", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: "No keyword" });

  try {
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    let products = [];
    $(".s-main-slot .s-result-item[data-asin]").each((_, el) => {
      const name = $(el).find("h2 a span").text().trim();
      const image = $(el).find("img.s-image").attr("src");
      const link = "https://www.amazon.in" + ($(el).find("h2 a").attr("href") || "");
      if (name && image) products.push({ name, image, link });
      if (products.length >= 2) return false;
    });
    // REAL scraping failed or empty? Show DUMMY data
    if (products.length === 0) products = [
      {
        name: "Floral Summer Dress",
        image: "https://images.pexels.com/photos/936119/pexels-photo-936119.jpeg",
        link: "https://www.amazon.in/s?k=floral+summer+dress"
      },
      {
        name: "Classic Black Shirt",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
        link: "https://www.amazon.in/s?k=black+shirt"
      },
      {
        name: "Elegant Red Gown",
        image: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
        link: "https://www.amazon.in/s?k=red+gown"
      },
      {
        name: "Casual Denim Jeans",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
        link: "https://www.amazon.in/s?k=denim+jeans"
      },
      {
        name: "Sporty Running Shoes",
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
        link: "https://www.amazon.in/s?k=running+shoes"
      }
    ];

    res.json({ products });
  } catch (err) {
    // On error, always return dummy products
    res.json({
      products: [
        {
          name: "Floral Summer Dress",
          image: "https://images.pexels.com/photos/936119/pexels-photo-936119.jpeg",
          link: "https://www.amazon.in/s?k=floral+summer+dress"
        },
        {
          name: "Classic Black Shirt",
          image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
          link: "https://www.amazon.in/s?k=black+shirt"
        },
        {
          name: "Elegant Red Gown",
          image: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
          link: "https://www.amazon.in/s?k=red+gown"
        },
        {
          name: "Casual Denim Jeans",
          image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
          link: "https://www.amazon.in/s?k=denim+jeans"
        },
        {
          name: "Sporty Running Shoes",
          image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
          link: "https://www.amazon.in/s?k=running+shoes"
        }
      ]
    });
  }
});

// 10. DUMMY RECOMMEND ENDPOINT (OPTIONAL)
app.post('/recommend', express.json(), (req, res) => {
  res.json({
    suggestions: [
      { name: 'Floral Dress', match: 0.94 },
      { name: 'Denim Jacket', match: 0.87 }
    ]
  });
});

// 11. START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
