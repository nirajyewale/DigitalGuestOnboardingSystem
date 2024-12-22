import express from 'express';
import Hotel from '../models/Hotel.js';
import Guest from '../models/Guest.js'; // Ensure this import is present
import upload from '../middleware/upload.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import QRCode from 'qrcode';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Route for displaying all hotels
router.get('/', async (req, res) => {
    const hotels = await Hotel.find();
    res.render('hotels', { hotels }); // Render the hotel list page
});

// Route for adding a new hotel
router.get('/add', (req, res) => {
    res.render('addHotel'); // Render the add hotel page
});

router.post('/add', upload.single('logo'), async (req, res) => {
    const { name, address } = req.body; // Extract 'name' and 'address' from the request body
    const logoPath = `/uploads/${req.file.filename}`; // Path for the uploaded logo image

    if (!name) {
        return res.status(400).send('Hotel name is required');
    }

    try {
        // Define the path for saving the QR code dynamically, using the hotel name
        const qrCodeImagePath = path.join(__dirname, '..', 'public', 'uploads', `${name}-qrcode.png`);

        const hotelPageUrl = `http://localhost:8001/hotel/view/${encodeURIComponent(name)}`;
        await QRCode.toFile(qrCodeImagePath, hotelPageUrl);       

        // Save the hotel details, including paths to the logo and QR code
        const hotel = new Hotel({
            name,
            address,
            logo: logoPath,
            qrCode: `/uploads/${name}-qrcode.png`,
        });

        await hotel.save();

        // Redirect to the hotel list page
        res.redirect('/hotel');
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Error generating QR code');
    }
});

// Route for displaying the hotel-specific landing page
router.get('/view/:name', async (req, res) => {
    const { name } = req.params;

    try {
        // Find the hotel by its name
        const hotel = await Hotel.findOne({ name: decodeURIComponent(name) });
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }

        // Render the hotel-specific landing page
        res.render('hotelLanding', { hotel });
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).send('Error fetching hotel details');
    }
});

// Route to display the guest registration form for a specific hotel
router.get('/register/:name', async (req, res) => {
    const { name } = req.params;

    try {
        // Find the hotel by its name
        const hotel = await Hotel.findOne({ name: decodeURIComponent(name) });
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }

        // Render the guest registration form
        res.render('guestRegister', { hotel });
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).send('Error fetching hotel details');
    }
});

// Route to handle guest form submission
router.post('/register/:name', async (req, res) => {
    const { name } = req.params;
    const { fullName, mobileNumber, address, purpose, stayFrom, stayTo, email, idProof } = req.body;

    try {
        // Save guest details to the database (create a model for guests)
        const guest = new Guest({
            hotelName: decodeURIComponent(name),
            fullName,
            mobileNumber,
            address,
            purpose,
            stayFrom,
            stayTo,
            email,
            idProof,
        });

        await guest.save();

        // Redirect to the thank you page
        res.render('thankYou', { guest, hotelName: decodeURIComponent(name) });
    } catch (error) {
        console.error('Error saving guest details:', error);
        res.status(500).send('Error saving guest details');
    }
});

export default router;
