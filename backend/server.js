const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './url.env' }); // ✅ Load from url.env

const app = express();

// Replace with your actual Vercel frontend domain
const allowedOrigin = 'https://my-portfolio-flax-one-48.vercel.app'; // ✅ UPDATE THIS

app.use(cors({ origin: allowedOrigin }));
app.use(bodyParser.json());

// MongoDB Atlas URI from url.env
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Contact schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    comment: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// API endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, comment } = req.body;

    if (!name || !email || !comment) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const newContact = new Contact({ name, email, comment });
        await newContact.save();
        res.status(201).json({ message: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
